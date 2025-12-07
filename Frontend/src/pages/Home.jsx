import React, { useState } from 'react';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(false);

  return (
    <>
      <PostForm onCreated={() => setRefreshKey(k => !k)} />
      <PostList key={String(refreshKey)} />
    </>
  );
}