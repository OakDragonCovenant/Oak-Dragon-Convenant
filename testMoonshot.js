/**
 * 🌙 Moonshot Test
 */

const LayeredAgentFramework = require('./OakDragonCovenant/Modules/layeredAgentFramework');

async function testMoonshot() {
    console.log('🌙 Oak Dragon Covenant - MOONSHOT TEST');
    console.log('=====================================');
    
    const framework = new LayeredAgentFramework('MoonshotTester', 'YOLO_AUTHORIZED');

    try {
        console.log('\n🚀 Testing Moonshot Command');
        console.log('------------------------------------------');
        
        const command = '!moonshot BTC/USD --risk=0.80 --emergency=0.05';
        console.log(`Executing: ${command}`);
        
        const result = await framework.executeRitual(command);
        console.log('🌙 Moonshot Results:', JSON.stringify(result, null, 2));

        console.log('\n🎲 Testing Extreme Volatility Trade');
        console.log('------------------------------------------');
        
        const volatilityCommand = '!extremerisk volatility --risk=0.60';
        console.log(`Executing: ${volatilityCommand}`);
        
        const volatilityResult = await framework.executeRitual(volatilityCommand);
        console.log('🎲 Volatility Results:', JSON.stringify(volatilityResult, null, 2));

        console.log('\n✅ All Moonshot Tests Complete');

    } catch (error) {
        console.error('❌ Moonshot Test Failed:', error.message);
    }
}

testMoonshot();
