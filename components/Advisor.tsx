
import React from 'react';

const Advisor: React.FC = () => {
  const recommendations = [
    {
      title: "Is this a winning project?",
      content: "Absolutely. Multi-modal content orchestration is the highest-value application of GenAI right now. Businesses struggle to keep up with the volume of high-quality assets required across platforms. By unifying SEO (Search), AEO (Answer Engines like Perplexity), and GEO (Generative Search), you are future-proofing your users' content strategy."
    },
    {
      title: "Recommended Features",
      content: [
        "Brand Voice Cloning: Let users upload 3-5 existing samples to fine-tune the output style.",
        "Batch Generation: Create a week's worth of social media content from a single blog URL.",
        "Platform Preview: Real-time UI mocks of how a post looks on X, LinkedIn, or Instagram.",
        "Content Repurposing: A 'Recycle' button that turns a 2-minute video into 5 short captions or a carousel."
      ]
    },
    {
      title: "Steps to Start",
      content: [
        "1. Prototype the Ideation Chat: Use Gemini-3-flash for rapid brainstorming.",
        "2. Build the Research Engine: Use Google Search Grounding to ensure factual accuracy.",
        "3. Integrate Veo: Add a Veo key selection dialog for high-quality video generation.",
        "4. Develop Templates: Create custom CSS-in-JS or SVG templates for 'Infographics' that Gemini can populate with data."
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">OmniContent Advisor 🤖</h2>
        <p className="text-blue-700">I've analyzed your project idea. Here are my strategic recommendations.</p>
      </div>

      <div className="grid gap-6">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{rec.title}</h3>
            {Array.isArray(rec.content) ? (
              <ul className="space-y-3">
                {rec.content.map((item, i) => (
                  <li key={i} className="flex items-start space-x-3 text-gray-600">
                    <span className="text-blue-500 mt-1">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 leading-relaxed">{rec.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Advisor;
