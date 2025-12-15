// src/utils/useAdmin.js
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onIdTokenChanged, getIdTokenResult } from "firebase/auth";
import { api } from "../api/client";

export function useAdmin(){
  const [state, setState] = useState({ user:null, isAdmin:false, loading:true });

  useEffect(()=>{
    const unsub = onIdTokenChanged(auth, async (u)=>{
      if(!u) return setState({ user:null, isAdmin:false, loading:false });
      try{
        const tok = await getIdTokenResult(u, true);
        let isAdmin = tok?.claims?.admin === true;
        if (!isAdmin) {
          // fallback: chiedi al backend se email è whitelisted
          try {
            const r = await api.get('/api/_auth/me');
            isAdmin = !!r.data?.isAdmin;
          } catch (err) {
            console.warn('Fallback admin check failed', err?.message || err);
          }
        }
        setState({ user:u, isAdmin, loading:false });
      }catch(err){
        console.error('Errore verifica admin', err);
        setState({ user:u, isAdmin:false, loading:false });
      }
    });
    return () => unsub();
  }, []);

  return state;
}

