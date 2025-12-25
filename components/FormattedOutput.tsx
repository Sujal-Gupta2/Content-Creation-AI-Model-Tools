
import React from 'react';

interface FormattedOutputProps {
  content: string;
}

const FormattedOutput: React.FC<FormattedOutputProps> = ({ content }) => {
  if (!content) return null;

  const renderContent = (text: string) => {
    const lines = text.split('\n');
    const processedNodes: React.ReactNode[] = [];
    let currentTable: string[][] = [];

    lines.forEach((line, idx) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('|')) {
        const rows = trimmedLine.split('|').filter(c => c.trim().length > 0 || trimmedLine.includes('||')).map(c => c.trim());
        if (rows.length > 0) {
          currentTable.push(rows);
        }
      } else {
        if (currentTable.length > 0) {
          processedNodes.push(
            <div key={`table-${idx}`} className="my-6 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-900 dark:text-gray-300">
                  <tr>
                    {currentTable[0].map((cell, i) => (
                      <th key={i} className="px-6 py-3 font-bold border-b dark:border-gray-800">{cell}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentTable.slice(1).filter(row => !row[0]?.includes('---')).map((row, i) => (
                    <tr key={i} className="bg-white dark:bg-gray-950 border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      {row.map((cell, j) => (
                        <td key={j} className="px-6 py-4 dark:text-gray-300">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          currentTable = [];
        }

        let isBullet = false;
        let lineToProcess = line;

        if (trimmedLine.startsWith('#')) {
          isBullet = true;
          lineToProcess = trimmedLine.replace(/^#\s*/, '');
        }

        // Apply *bolding* and strip signs
        const boldRegex = /\*(.*?)\*/g;
        const parts = lineToProcess.split(boldRegex);
        const formattedLine: React.ReactNode[] = parts.map((part, i) => 
          i % 2 === 1 ? <strong key={i} className="font-black text-gray-900 dark:text-white">{part}</strong> : part
        );

        if (isBullet) {
          processedNodes.push(
            <div key={idx} className="flex items-start space-x-3 my-2 group ml-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 group-hover:scale-125 transition-transform shrink-0" />
              <div className="flex-1 text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">{formattedLine}</div>
            </div>
          );
        } else if (trimmedLine === '-' || trimmedLine === '---') {
          processedNodes.push(<hr key={idx} className="my-6 border-gray-200 dark:border-gray-800" />);
        } else if (trimmedLine.length > 0) {
          processedNodes.push(<p key={idx} className="mb-4 text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">{formattedLine}</p>);
        } else {
          processedNodes.push(<div key={idx} className="h-2" />);
        }
      }
    });

    return processedNodes;
  };

  return (
    <div className="prose prose-blue dark:prose-invert max-w-none animate-in fade-in duration-700 font-sans">
      {renderContent(content)}
    </div>
  );
};

export default FormattedOutput;
