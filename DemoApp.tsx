import React from 'react';
import { ImprovedChoreChart } from './ImprovedChoreChart';

// Sample data matching what you showed in screenshots
const sampleData = {
  childName: "TEDDY",
  tasks: [
    {
      id: 'task-1',
      title: 'Brush Teeth',
      type: 'morning' as const,
      tileImageUrl: undefined, // You'd add actual image URLs
    },
    {
      id: 'task-2',
      title: 'Get Dressed',
      type: 'morning' as const,
    },
    {
      id: 'task-3',
      title: 'Put Shoes On',
      type: 'morning' as const,
    },
    {
      id: 'task-4',
      title: 'Clean Up Toys',
      type: 'evening' as const,
    },
  ],
  chores: [
    {
      id: 'chore-1',
      title: 'Walking Bumble',
      value: '50p',
    },
    {
      id: 'chore-2',
      title: 'Dishwasher',
      value: '50p',
    },
  ],
  rewardGoal: {
    goalName: 'Octonaut Toy',
    targetAmount: '25.00',
    currencySymbol: '£',
  },
};

export const DemoApp: React.FC = () => {
  const handleUpdate = (data: any) => {
    console.log('Chart updated:', data);
    // Here you'd save to localStorage, database, etc.
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-block">
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ✨ Magic Chart Maker
            </h1>
            <p className="text-gray-600 mt-2">
              Interactive chore charts that actually work with kids
            </p>
          </div>
        </div>

        {/* Device Preview Tabs */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Preview Mode</h2>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
              <div className="text-sm font-semibold text-purple-600 mb-1">📱 Mobile First</div>
              <div className="text-xs text-gray-600">Perfect for parents on-the-go</div>
            </div>
            <div className="flex-1 p-4 bg-pink-50 rounded-xl border-2 border-pink-200">
              <div className="text-sm font-semibold text-pink-600 mb-1">✏️ Edit Mode</div>
              <div className="text-xs text-gray-600">Click "Edit Chart" to customize</div>
            </div>
            <div className="flex-1 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
              <div className="text-sm font-semibold text-blue-600 mb-1">🖨️ Print Ready</div>
              <div className="text-xs text-gray-600">Clean PDFs for wall mounting</div>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <h3 className="font-bold text-gray-700 text-sm">✅ What's New</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• <strong>Touch-friendly checkboxes</strong> - Big, clear, satisfying to tap</li>
                <li>• <strong>Portrait mode</strong> - Easier to view on phones</li>
                <li>• <strong>Inline editing</strong> - Click any text to change it</li>
                <li>• <strong>Add/remove tasks</strong> - Fully customizable</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-gray-700 text-sm">🎯 Why It Works</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• <strong>Visual progress</strong> - Kids see their achievements</li>
                <li>• <strong>Clear goals</strong> - Saving for specific rewards</li>
                <li>• <strong>Daily routine</strong> - Morning & evening structure</li>
                <li>• <strong>Parent control</strong> - Easy updates without regenerating</li>
              </ul>
            </div>
          </div>
        </div>

        {/* The Actual Chart */}
        <ImprovedChoreChart
          {...sampleData}
          headerImageUrl={undefined} // Add your ocean theme header
          rewardImageUrl={undefined} // Add Octonaut toy image
          storageKey="teddy-chart" // Unique key for this child's data
          onUpdate={handleUpdate}
        />

        {/* Implementation Guide */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Implementation Roadmap</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-purple-600 mb-2">Phase 1: Test with Your Kids (This Week)</h3>
              <div className="pl-4 border-l-4 border-purple-200 space-y-2 text-gray-700">
                <p>✅ <strong>Deploy current version</strong> - Use Vercel for instant hosting</p>
                <p>✅ <strong>Create charts for both kids</strong> - Age-appropriate tasks (simpler for your 2yo)</p>
                <p>✅ <strong>Test digital mode first</strong> - Use your phone/tablet, see if they engage</p>
                <p>✅ <strong>Print a version</strong> - Laminate it, use dry-erase markers</p>
                <p>💡 <strong>Track what works</strong> - Which motivates them more: digital taps or physical stickers?</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-green-600 mb-2">Phase 2: Refine Based on Real Use (Week 2-3)</h3>
              <div className="pl-4 border-l-4 border-green-200 space-y-2 text-gray-700">
                <p>📊 <strong>Analyze behavior</strong> - Do they check off tasks independently?</p>
                <p>🎨 <strong>Iterate design</strong> - More animations? Celebration sounds?</p>
                <p>🔧 <strong>Add features they want</strong> - Maybe a "completed week" celebration screen?</p>
                <p>💾 <strong>Add save/sync</strong> - Progress persists across devices</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-blue-600 mb-2">Phase 3: Polish for Public Launch (Month 2)</h3>
              <div className="pl-4 border-l-4 border-blue-200 space-y-2 text-gray-700">
                <p>📱 <strong>Progressive Web App (PWA)</strong> - Install to home screen like a native app</p>
                <p>🎨 <strong>More themes</strong> - Not just ocean/pirates (space, dinosaurs, princesses, etc.)</p>
                <p>🤝 <strong>Multi-child support</strong> - Parents with 2+ kids need separate charts</p>
                <p>💰 <strong>Monetization decision</strong> - Free with premium themes? $2.99 one-time? Subscription?</p>
                <p>🚀 <strong>App Store submission</strong> - iOS TestFlight first, then full launch</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Next Steps */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-xl border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🛠️ Technical Improvements Needed</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-700 mb-3">Critical Fixes</h3>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-white rounded-lg border border-red-200">
                  <div className="font-semibold text-red-700">Checkbox State Persistence</div>
                  <div className="text-gray-600 text-xs mt-1">Currently resets on reload - needs localStorage or DB</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-orange-200">
                  <div className="font-semibold text-orange-700">Mobile Touch Optimization</div>
                  <div className="text-gray-600 text-xs mt-1">Add haptic feedback, prevent zoom on double-tap</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-yellow-200">
                  <div className="font-semibold text-yellow-700">Print Layout</div>
                  <div className="text-gray-600 text-xs mt-1">Test actual printer output - might need page breaks</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-700 mb-3">Nice-to-Haves</h3>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-white rounded-lg border border-blue-200">
                  <div className="font-semibold text-blue-700">Celebration Animations</div>
                  <div className="text-gray-600 text-xs mt-1">Confetti when a week is completed</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <div className="font-semibold text-purple-700">Sound Effects</div>
                  <div className="text-gray-600 text-xs mt-1">Satisfying "ding" on checkbox tap (optional)</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-pink-200">
                  <div className="font-semibold text-pink-700">Progress Dashboard</div>
                  <div className="text-gray-600 text-xs mt-1">Visual chart showing weekly completion rates</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deployment Guide */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 shadow-xl text-white">
          <h2 className="text-2xl font-bold mb-4">🚀 Deploy in 5 Minutes</h2>
          
          <div className="space-y-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div>
              <div className="font-bold mb-1">1. Push to GitHub</div>
              <code className="text-xs bg-black/30 px-2 py-1 rounded">git push origin main</code>
            </div>
            <div>
              <div className="font-bold mb-1">2. Connect to Vercel</div>
              <div className="text-sm opacity-90">Import your repo → Auto-deploys on every commit</div>
            </div>
            <div>
              <div className="font-bold mb-1">3. Get shareable URL</div>
              <code className="text-xs bg-black/30 px-2 py-1 rounded">magic-chart-maker.vercel.app</code>
            </div>
            <div className="pt-2 border-t border-white/20">
              <div className="text-sm">💡 <strong>Pro tip:</strong> Add to home screen on your phone - works like a native app!</div>
            </div>
          </div>
        </div>

        {/* Monetization Strategy */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💰 Potential Business Model</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <div className="text-green-600 font-bold mb-2">Free Tier</div>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• 1 child chart</li>
                <li>• Basic ocean theme</li>
                <li>• Manual task entry</li>
                <li>• Print/export</li>
              </ul>
              <div className="mt-3 text-xs text-gray-500">Hook: Parents try it, love it</div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-400 relative">
              <div className="absolute -top-2 right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                SWEET SPOT
              </div>
              <div className="text-blue-600 font-bold mb-2">Premium - $4.99</div>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Unlimited children</li>
                <li>• 10+ themes</li>
                <li>• AI character generation</li>
                <li>• Progress analytics</li>
                <li>• Cloud sync</li>
              </ul>
              <div className="mt-3 text-xs text-gray-500">One-time payment</div>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
              <div className="text-purple-600 font-bold mb-2">Enterprise - Custom</div>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• School/daycare licenses</li>
                <li>• Classroom management</li>
                <li>• Parent portals</li>
                <li>• White-label option</li>
              </ul>
              <div className="mt-3 text-xs text-gray-500">Think bigger: 1000+ users</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-400">
            <div className="font-bold text-yellow-800 mb-1">💡 Market Reality Check</div>
            <div className="text-sm text-gray-700">
              Parents will pay $5-10 for something that <em>actually works</em> to get their kids to do chores. 
              The market is flooded with free apps that look cheap and don't engage kids. 
              Your advantage: <strong>Beautiful AI-generated characters that kids love</strong> + <strong>Actually functional UX</strong>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoApp;
