import { getAds } from "@/lib/api";
import AdsManager from "@/components/admin/AdsManager";

export default async function AdsPage() {
  const ads = await getAds();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Publicidad</h1>
      <p className="mt-1 text-sm text-gray-600">
        Banners que se muestran en carrusel arriba del catalogo publico.
      </p>

      <div className="mt-6">
        <AdsManager ads={ads} />
      </div>
    </div>
  );
}
