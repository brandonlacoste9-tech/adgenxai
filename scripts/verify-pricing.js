/**
 * Pricing Optimization Verification Script
 * 
 * This script validates that the cost optimization pricing changes
 * have been correctly applied to the Pricing component.
 * 
 * It checks for:
 * - New optimized prices ($19 Creator, $49 Studio)
 * - Removal of old prices ($29 Creator, $99 Studio)
 * - Maintenance of Starter tier pricing ($9)
 */

const fs = require('fs');
const path = require('path');

const pricingFile = path.join(__dirname, '..', 'app', 'components', 'Pricing.tsx');
const content = fs.readFileSync(pricingFile, 'utf8');

console.log('🔍 Validating Pricing Optimization...\n');

// Check for optimized prices
const hasCreator19 = content.includes('$19/mo');
const hasStudio49 = content.includes('$49/mo');
const hasStarter9 = content.includes('$9/mo');

// Verify old prices are NOT present
const hasOldCreator = content.includes('$29/mo');
const hasOldStudio = content.includes('$99/mo');

console.log('✅ Pricing Validation Results:');
console.log(`   Creator tier ($19/mo):  ${hasCreator19 ? '✓ FOUND' : '✗ MISSING'}`);
console.log(`   Studio tier ($49/mo):   ${hasStudio49 ? '✓ FOUND' : '✗ MISSING'}`);
console.log(`   Starter tier ($9/mo):   ${hasStarter9 ? '✓ FOUND' : '✗ MISSING'}`);
console.log();
console.log('❌ Old Pricing Check (should be removed):');
console.log(`   Old Creator ($29/mo):   ${hasOldCreator ? '✗ STILL PRESENT' : '✓ REMOVED'}`);
console.log(`   Old Studio ($99/mo):    ${hasOldStudio ? '✗ STILL PRESENT' : '✓ REMOVED'}`);
console.log();

if (hasCreator19 && hasStudio49 && hasStarter9 && !hasOldCreator && !hasOldStudio) {
  console.log('🎉 SUCCESS: All pricing optimizations validated!');
  console.log('💰 Cost Optimization Strategy: DEPLOYED');
  console.log('   - Creator: 33% reduction ($29 → $19)');
  console.log('   - Studio: 50% reduction ($99 → $49)');
  process.exit(0);
} else {
  console.log('⚠️  WARNING: Some pricing checks failed');
  process.exit(1);
}
