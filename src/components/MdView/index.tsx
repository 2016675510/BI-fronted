import ReactMarkdown from 'react-markdown';

import 'highlight.js/styles/atom-one-dark.css';
import remarkGfm from 'remark-gfm';

const MdView = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown className="prose prose-zinc max-w-none" remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
};

export default MdView;
