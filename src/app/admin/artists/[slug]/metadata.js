export async function generateMetadata({ params }) {
  // For metadata we don't need to use React.use() since this is a server function
  // The warning is only for client components that directly access params properties
  const { slug } = params;
  
  return {
    title: `Artist Details: ${slug} | Soul Distribution`,
    description: 'View and manage artist details',
  };
} 