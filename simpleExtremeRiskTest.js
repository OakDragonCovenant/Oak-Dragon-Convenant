/**
 * 🚀 Simple Extreme Risk Test
 */

const LayeredAgentFramework = require('./OakDragonCovenant/Modules/layeredAgentFramework');

async function simpleExtremeRiskTest() {
    console.log('🚀 Oak Dragon Covenant - EXTREME RISK TRADING TEST');
    console.log('====================================================');
    console.log('⚠️  WARNING: Testing MAXIMUM RISK trading capabilities!');
    console.log('====================================================');

    // Initialize the framework
    const framework = new LayeredAgentFramework('ExtremeRiskTester', 'YOLO_TESTING_ENTITY');

    try {
        console.log('\n🎯 Testing Extreme Risk Assessment');
        console.log('------------------------------------------');
        
        const command = '!extremerisk assess --portfolio=8.89';
        console.log(`Executing: ${command}`);
        
        // Parse the command first to debug
        const parsedCommand = framework.parseRitualCommand(command);
        console.log('Parsed command:', JSON.stringify(parsedCommand, null, 2));
        
        const result = await framework.executeRitual(command);
        console.log('📊 Assessment Results:', JSON.stringify(result, null, 2));

        console.log('\n✅ Extreme Risk Test Complete');

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        console.error('Stack:', error.stack);
    }
}

// Run the test
simpleExtremeRiskTest();
