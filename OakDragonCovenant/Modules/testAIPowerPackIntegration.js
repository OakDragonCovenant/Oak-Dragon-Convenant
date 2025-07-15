/**
 * Test AI Power Pack Integration with Layered Agent Framework
 * Demonstrates enhanced content generation capabilities
 */

const LayeredAgentFramework = require('./layeredAgentFramework');

async function testAIPowerPackIntegration() {
    console.log('🐉 Testing AI Power Pack Integration with Oak Dragon Covenant\n');

    // 1. Initialize Layered Agent Framework with AI Power Pack
    const framework = new LayeredAgentFramework('AI-Enhanced-Framework', 'MSO_TEXAS_LLC');
    
    // 2. Initialize AI Power Pack integration
    const aiCredentials = {
        apiKey: 'ai-power-pack-api-key',
        userId: 'oak-dragon-covenant',
        planType: 'lifetime-access'
    };
    
    const initResult = await framework.layers.content.initializeAIPowerPack(aiCredentials);
    console.log('✅ AI Power Pack Integration:', initResult);
    console.log('');

    // 3. Test Content Generation for Different Agent Types
    console.log('📝 Testing Content Generation Capabilities:\n');

    // Generate governance documentation
    const governanceDoc = await framework.layers.content.generateContent('governance', {
        title: 'Multi-Tiered Organizational Structure',
        topic: 'legal entity management across jurisdictions'
    });
    console.log('🏛️ Governance Document Generated:');
    console.log(governanceDoc.content.substring(0, 200) + '...\n');

    // Generate trading analysis
    const tradingReport = await framework.layers.content.generateTradingReports({
        trend: 'bullish',
        pnl: 1250.50,
        exchanges: ['coinbase', 'kraken', 'gemini', 'mexc']
    });
    console.log('📈 Trading Report Generated:');
    console.log(tradingReport.content.substring(0, 200) + '...\n');

    // Generate marketing content
    const marketingContent = await framework.layers.content.generateContent('marketing', {
        title: 'Oak Dragon Covenant Services',
        industry: 'autonomous financial management'
    });
    console.log('🎯 Marketing Content Generated:');
    console.log(marketingContent.content.substring(0, 200) + '...\n');

    // 4. Test Organizational Documentation Generation
    console.log('🏢 Generating Complete Organizational Documentation:\n');
    
    const entityDocs = await framework.layers.content.generateOrganizationalDocuments(
        'WYOMING_DAO_LLC', 
        'Wyoming'
    );
    
    entityDocs.forEach(doc => {
        console.log(`📄 ${doc.type.toUpperCase()}: ${doc.title}`);
        console.log(`   Generated: ${doc.generated}`);
        console.log(`   Preview: ${doc.content.substring(0, 150)}...\n`);
    });

    // 5. Test Social Media Campaign Generation
    console.log('📱 Generating Social Media Campaign:\n');
    
    const socialPosts = await framework.layers.content.generateSocialMediaCampaign({
        message: 'Revolutionary autonomous trading and organizational management',
        themes: ['innovation', 'mystique', 'financial-freedom'],
        hashtags: ['#OakDragonCovenant', '#AutonomousTrading', '#AI']
    });
    
    socialPosts.forEach((post, index) => {
        console.log(`📱 Social Post ${index + 1}: ${post}\n`);
    });

    // 6. Test Enhanced Agent Deployment with Content Generation
    console.log('🚀 Testing Enhanced Agent Deployment:\n');
    
    const deploymentConfig = {
        id: 'thalrion-enhanced-test',
        type: 'thalrion',
        mode: 'guardian',
        region: 'vault-nexus',
        requester: 'MSO_TEXAS_LLC'
    };

    try {
        const deployment = await framework.deployAgent(deploymentConfig);
        console.log('✅ Enhanced Agent Deployment Successful:');
        console.log(`   Agent ID: ${deployment.id}`);
        console.log(`   Status: ${deployment.status}`);
        console.log(`   Documentation: ${deployment.documentation ? 'Generated' : 'Not available'}`);
        console.log('');
    } catch (error) {
        console.log(`❌ Deployment Error: ${error.message}\n`);
    }

    // 7. Show Token Usage Statistics
    const usage = framework.layers.content.getUsageStatistics();
    console.log('📊 AI Power Pack Usage Statistics:');
    console.log(`   Total Tokens: ${usage.totalTokens}`);
    console.log(`   Tokens Used: ${usage.tokensUsed}`);
    console.log(`   Tokens Remaining: ${usage.tokensRemaining}`);
    console.log(`   Usage Percentage: ${usage.usagePercentage}%`);
    console.log('');

    // 8. Test Ritual-Based Content Generation
    console.log('🔮 Testing Ritual-Based Content Generation:\n');
    
    const ritualCommand = '!deploy crypto-guardian --mode=multi-exchange --region=digital-realm';
    const ritualResult = await framework.executeRitual(ritualCommand);
    
    if (ritualResult) {
        console.log('✅ Ritual Execution with Content Generation:');
        console.log(`   Agent Type: ${ritualResult.type}`);
        console.log(`   Components: Assistant, MicroAI, Nano`);
        console.log(`   Documentation: Auto-generated via AI Power Pack`);
    }

    console.log('\n🐉 AI Power Pack Integration Test Complete!');
    console.log('💡 Benefits Demonstrated:');
    console.log('   • Automated content generation for all organizational operations');
    console.log('   • Professional documentation for legal entities');
    console.log('   • Marketing materials for legitimacy building');
    console.log('   • Trading reports and analysis automation');
    console.log('   • Social media campaign generation');
    console.log('   • Enhanced agent deployment with auto-documentation');
    console.log('   • Token usage tracking and optimization');
}

// Execute the test
if (require.main === module) {
    testAIPowerPackIntegration().catch(console.error);
}

module.exports = { testAIPowerPackIntegration };
