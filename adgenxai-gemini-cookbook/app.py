from fastapi import FastAPI, Form, UploadFile, File
from fastapi.responses import HTMLResponse, StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from google import generativeai as genai
from dotenv import load_dotenv
import asyncio, os, uuid, pyttsx3, speech_recognition as sr, json
from datetime import datetime

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY missing from environment.")
genai.configure(api_key=api_key)

app = FastAPI(title="AdgenxAI Gemini Fusion Suite")

os.makedirs("speech", exist_ok=True)
os.makedirs("logs", exist_ok=True)
app.mount("/speech", StaticFiles(directory="speech"), name="speech")

def get_logfile():
    return os.path.join("logs", f"{datetime.now().date()}.json")

def write_log(entry):
    log_file = get_logfile()
    if not os.path.exists(log_file):
        with open(log_file, "w") as f:
            json.dump([], f)
    with open(log_file, "r") as f:
        data = json.load(f)
    data.append(entry)
    with open(log_file, "w") as f:
        json.dump(data, f, indent=2)

@app.get("/", response_class=HTMLResponse)
def dashboard():
    return """
    <html>
    <head>
      <title>AdgenxAI Gemini Fusion Suite</title>
      <style>
        body { background:#0d0d0d; color:#e0e0e0; font-family:Consolas, monospace; margin:30px; }
        textarea,button,input {
          background:#1a1a1a; color:#e0e0e0; border:1px solid #333; border-radius:5px; padding:8px;
        }
        #output,#logview,#results {
          background:#181818; margin-top:15px; padding:10px; border-radius:8px; overflow-y:auto;
        }
        #output { height:230px; }
        #logview { height:180px; }
        #results { height:200px; }
        .action { margin-top:10px; border:none; border-radius:5px; padding:8px 14px; cursor:pointer; }
        #export { background:#0078d7; color:white; }
        #export:hover { background:#0a84ff; }
        #clear { background:#d33; color:white; }
        #clear:hover { background:#ff4d4d; }
      </style>
    </head>
    <body>
      <h2>AdgenxAI Fusion Dashboard</h2>
      <textarea id="prompt" rows="4" cols="80" placeholder="Type or record a prompt..."></textarea><br/>
      <button onclick="recordAudio()">🎙️ Speak</button>
      <button onclick="runGemini()">Stream</button>
      <audio id="audio" controls hidden></audio>

      <div id="output"></div>

      <div>
        <button id="export" class="action" onclick="downloadLogs()">⬇ Download Today's Log</button>
        <button id="clear" class="action" onclick="clearLogs()">🗑 Clear Log</button>
      </div>

      <h3>Recent Logs</h3>
      <div id="logview"></div>

      <h3>Search Logs</h3>
      <input id="keyword" type="text" size="40" placeholder="Search keyword..."/>
      <input id="start" type="datetime-local"/>
      <input id="end" type="datetime-local"/>
      <button onclick="filterLogs()">Filter</button>
      <div id="results"></div>

      <script>
        let tokens=0, responseText="", startTime=0;
        async function recordAudio(){
          const stream=await navigator.mediaDevices.getUserMedia({audio:true});
          const rec=new MediaRecorder(stream); let data=[];
          rec.ondataavailable=e=>data.push(e.data);
          rec.onstop=async()=>{
            const blob=new Blob(data,{type:'audio/webm'});
            stream.getTracks().forEach(t=>t.stop());
            const form=new FormData(); form.append("audio",blob);
            const r=await fetch("/voiceprompt",{method:"POST",body:form}).then(r=>r.json());
            document.getElementById("prompt").value=r.text;
          }
          rec.start(); setTimeout(()=>rec.stop(),4000);
        }

        function runGemini(){
          const p=document.getElementById("prompt").value;
          const out=document.getElementById("output");
          const audio=document.getElementById("audio");
          out.innerHTML="<em>Streaming...</em><br/>";
          responseText=""; tokens=0; startTime=performance.now();
          const ev=new EventSource("/stream?prompt="+encodeURIComponent(p));
          ev.onmessage=e=>{
            if(e.data==="[DONE]"){
              const elapsed=(performance.now()-startTime)/1000;
              fetch("/tts?prompt="+encodeURIComponent(p))
                .then(r=>r.json()).then(d=>{
                  audio.src=d.audio_url; audio.hidden=false; audio.play();
                });
              fetch("/log",{method:"POST",headers:{'Content-Type':'application/json'},
                body:JSON.stringify({prompt:p,response:responseText,tokens:tokens,
                elapsed:elapsed,timestamp:new Date().toISOString()})});
              setTimeout(loadLogs,800);
              return;
            }
            tokens++; responseText+=e.data; out.innerHTML+=e.data;
          }; ev.onerror=()=>ev.close();
        }

        function loadLogs(){fetch("/logs/latest").then(r=>r.text()).then(h=>{document.getElementById("logview").innerHTML=h})}
        function downloadLogs(){window.location.href="/logs/download";}
        function clearLogs(){ if(confirm('Clear today's log?')) fetch("/logs/clear",{method:"POST"}).then(()=>loadLogs()); }

        function filterLogs(){
          const key=document.getElementById("keyword").value;
          const s=document.getElementById("start").value;
          const e=document.getElementById("end").value;
          let url="/logs/filter?keyword="+encodeURIComponent(key);
          if(s) url+="&start="+encodeURIComponent(s);
          if(e) url+="&end="+encodeURIComponent(e);
          fetch(url).then(r=>r.text()).then(h=>{document.getElementById("results").innerHTML=h});
        }
        window.onload=loadLogs;
      </script>
    </body>
    </html>
    """

@app.post("/log")
async def save_log(entry: dict):
    write_log(entry)
    return {"status": "logged"}

@app.get("/logs/latest", response_class=HTMLResponse)
def latest_logs():
    f = get_logfile()
    if not os.path.exists(f): return "<em>No logs yet today.</em>"
    with open(f) as j: data = json.load(j)
    html=""
    for e in reversed(data[-5:]):
        html += f"<div style='border-bottom:1px solid #333;padding:5px;'>"
        html += f"<b>{e['timestamp']}</b><br/>Prompt: {e['prompt']}<br/>Tokens: {e['tokens']} | Time: {e['elapsed']:.2f}s<br/><i>{e['response'][:150]}...</i></div>"
    return html or "<em>No entries yet.</em>"

@app.get("/logs/download")
def download_logfile():
    f = get_logfile()
    if not os.path.exists(f): 
        with open(f,"w") as z: json.dump([], z)
    return FileResponse(f, filename=f"adgenxai_log_{datetime.now().date()}.json", media_type="application/json")

@app.post("/logs/clear")
def clear_logs():
    f = get_logfile()
    with open(f,"w") as z: json.dump([], z)
    return {"status":"cleared"}

@app.get("/logs/filter", response_class=HTMLResponse)
def filter_logs(keyword: str = "", start: str = None, end: str = None):
    f = get_logfile()
    if not os.path.exists(f): return "<em>No logs found.</em>"
    with open(f) as j: data = json.load(j)
    keyword = keyword.lower()
    from datetime import datetime
    s = datetime.fromisoformat(start) if start else datetime.now().replace(hour=0, minute=0, second=0)
    e = datetime.fromisoformat(end) if end else datetime.now().replace(hour=23, minute=59, second=59)
    result=[]
    for entry in data:
        t=datetime.fromisoformat(entry["timestamp"])
        if s<=t<=e and (keyword in entry["prompt"].lower() or keyword in entry["response"].lower()):
            result.append(entry)
    if not result: return "<em>No matches found.</em>"
    html="<b>Filtered Results:</b><br/>"
    for e in reversed(result[-20:]):
        html+=f"<div style='border-bottom:1px solid #333;padding:5px;'>"
        html+=f"<b>{e['timestamp']}</b><br/>Prompt: {e['prompt']}<br/>Tokens: {e['tokens']} | Time: {e['elapsed']:.2f}s<br/><i>{e['response'][:150]}...</i></div>"
    return html

@app.get("/stream")
async def stream(prompt: str):
    m = genai.GenerativeModel("gemini-2.5-pro")
    async def generate():
        async for chunk in m.generate_content_async(prompt, stream=True):
            yield f"data: {chunk.text or ''}\n\n"
            await asyncio.sleep(0.01)
        yield "data: [DONE]\n\n"
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.post("/voiceprompt")
async def transcribe(audio: UploadFile = File(...)):
    r = sr.Recognizer()
    fp=f"speech/{uuid.uuid4()}.wav"
    with open(fp,"wb") as f: f.write(await audio.read())
    with sr.AudioFile(fp) as src:
        result = r.recognize_google(r.record(src))
    return {"text": result}

@app.get("/tts")
def text_to_speech(prompt: str):
    fname=f"speech/{uuid.uuid4()}.mp3"
    engine=pyttsx3.init()
    engine.save_to_file(prompt,fname)
    engine.runAndWait()
    return {"audio_url": f"/{fname}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)