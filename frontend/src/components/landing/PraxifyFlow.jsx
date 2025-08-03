import { MessageSquare, FileText, PencilLine, ArrowDown } from 'lucide-react'

function PraxifyFlow() {
  const steps = [
    {
      icon: <PencilLine className="w-8 h-8 text-white" />,
      title: "Describe Your Vision",
      description: "Write your initial project idea in plain language. No technical knowledge required.",
      color: "from-primary-600 to-primary-700"
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-white" />,
      title: "Collab with AI",
      description: "Praxify Assistant helps refine and structure your requirements.",
      color: "from-secondary-600 to-secondary-700"
    },
    {
      icon: <FileText className="w-8 h-8 text-white" />,
      title: "Generate Specs",
      description: "Get validated requirements and diagrams instantly.",
      color: "from-primary-500 to-primary-600"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary-800 mb-4">The Praxify Flow</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-primary-700 mx-auto rounded-full" />
        </div>

        <div className="flex flex-col items-center space-y-10">
          {steps.map((step, index) => (
            <div key={index} className={`card p-8 w-full text-white bg-gradient-to-br ${step.color}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
              </div>
              <p className="text-white/90 text-sm">{step.description}</p>
            </div>
          )).flatMap((component, index, arr) => index < arr.length - 1
            ? [component, <ArrowDown key={`arrow-${index}`} className="text-primary-400 w-8 h-8" />]
            : [component]
          )}
        </div>
      </div>
    </section>
  );
}

export default PraxifyFlow;
