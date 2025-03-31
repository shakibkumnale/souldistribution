'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Instagram } from 'lucide-react';

export default function InstagramFeed() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchInstagramPosts() {
      try {
        const response = await fetch('/api/instagram'); // API route to handle authentication & fetching
        if (!response.ok) {
          throw new Error('Failed to fetch Instagram posts');
        }
        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchInstagramPosts();
  }, []);

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center">
            <Instagram className="h-6 w-6 text-orange-500 mr-2" />
            <h2 className="text-3xl font-bold text-white">Follow Our Journey</h2>
          </div>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            Get behind-the-scenes content, success stories, and updates from our artists.
          </p>
        </div>
        
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {posts.map((post) => (
            <a 
              key={post.id} 
              href={post.permalink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="bg-black rounded-lg overflow-hidden transition transform group-hover:scale-105">
                <div className="relative aspect-square">
                  <Image 
                    src={post.media_url} 
                    alt={post.caption || 'Instagram post'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-white truncate">{post.caption}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
