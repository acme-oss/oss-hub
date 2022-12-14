export default {
  p: ({ children }) => <p className="markdown-element">{children}</p>,
  a: ({ children, href }) => (
    <a
      className="markdown-element text-blue-500"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  ),
  li: ({ children }) => <li className="markdown-element">{children}</li>,
  ul: ({ children }) => <ul className="markdown-element">{children}</ul>,
  ol: ({ children }) => <ol className="markdown-element">{children}</ol>,
  // We only allow a single h1 per page, so we downgrade each header level to
  // follow a logical hierarchy
  h1: ({ children }) => <h2 className="markdown-element">{children}</h2>,
  h2: ({ children }) => <h3 className="markdown-element">{children}</h3>,
  h3: ({ children }) => <h4 className="markdown-element">{children}</h4>,
  h4: ({ children }) => <h5 className="markdown-element">{children}</h5>,
  h5: ({ children }) => <h5 className="markdown-element">{children}</h5>,
  img: (props) => <img className="markdown-element" {...props} />,
  inlineCode: ({ children }) => (
    <code className="markdown-element bg-black-50">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="markdown-element bg-black-50 text-black-500">
      {children}
    </pre>
  ),
};
