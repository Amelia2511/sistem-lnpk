// src/app/resolvers/skt-meta.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { of, catchError } from 'rxjs';
import { SasaranKerjaService } from '../services/sasaran-kerja.service';

// What the resolver will return to the route's data
export type SktMeta = {
  idSkt: number;
  tahunPenilaian: number | null;
  namaKategoriPenilaian: string | null;
};

export const sktMetaResolver: ResolveFn<SktMeta | null> = (route) => {
  const router = inject(Router);
  const skService = inject(SasaranKerjaService);

  // 1) Prefer query param
  const qp = route.queryParamMap.get('idSkt');
  const idSkt = qp ? Number(qp) : Number(history.state?.idSkt ?? NaN);

  if (!idSkt || Number.isNaN(idSkt)) {
    // No valid idSkt → go back to list (or anywhere sensible)
    router.navigate(['/senarai-sasaran']);
    return of(null);
  }

  // 2) If the caller passed meta via router state, reuse it (no HTTP)
  const tahunPenilaian = history.state?.tahunPenilaian ?? null;
  const namaKategoriPenilaian = history.state?.namaKategoriPenilaian ?? null;
  if (tahunPenilaian !== null && namaKategoriPenilaian !== null) {
    return of({ idSkt, tahunPenilaian, namaKategoriPenilaian });
  }

  // 3) Otherwise fetch from backend
  return skService.getSasaranKerjaById(idSkt).pipe(
    catchError(() => {
      router.navigate(['/senarai-sasaran']);
      return of(null);
    })
  );
};
