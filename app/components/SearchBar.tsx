"use client";

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';

export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  // Referencia para el timer del debounce
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback((term: string) => {
    // Limpiar el timer anterior si el usuario sigue escribiendo
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Esperar 300ms antes de buscar para no saturar el servidor
    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      
      if (term) {
        params.set('q', term);
      } else {
        params.delete('q');
      }
      
      // Actualizar la URL sin recargar la página
      replace(`${pathname}?${params.toString()}`);
    }, 300);
  }, [searchParams, pathname, replace]);

  return (
    <div className="search-container">
      <span className="search-icon">🔍</span>
      <input 
        type="text" 
        className="search-input" 
        placeholder="Buscar por nombre o cédula..." 
        defaultValue={searchParams.get('q')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
