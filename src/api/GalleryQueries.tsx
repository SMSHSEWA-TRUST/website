import { useQuery } from "@tanstack/react-query";
import { getGallery, GalleryResponse } from "@/services/gallery.service";

export const QueryKeys = {
    gallery: "gallery",
    getGallery: ["gallery", "getGallery"],
};

export const useGetGallery = () =>
    useQuery<GalleryResponse>({
        queryKey: QueryKeys.getGallery,
        queryFn: () => getGallery(),
    });