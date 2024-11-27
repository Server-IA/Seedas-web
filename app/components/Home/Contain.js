import React from 'react';
import Details from './Details';

function Contain({ publications }) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Mis Publicaciones</h2>
      {publications.length > 0 ? (
        publications.map((pub) => (
          <Details key={pub.id} data={pub} />
        ))
      ) : (
        <p>No tienes publicaciones registradas.</p>
      )}
    </div>
  );
}

export default Contain;
