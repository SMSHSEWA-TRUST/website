import { getTestimonials, TestimonialItem } from "@/services/testimonial.service";
import { useQuery } from "@tanstack/react-query";

export const QueryKeys = {
    testimonial: "testimonial",
    getTestimonials: ["testimonial", "getTestimonials"],
};

export const useGetTestimonials = () =>
    useQuery<any, Error, TestimonialItem[]>({
        queryKey: QueryKeys.getTestimonials,
        queryFn: getTestimonials,
        select: (res: any) => {
            // Handle various response shapes:
            const maybe = res?.data ?? res;
            if (Array.isArray(maybe)) return maybe as TestimonialItem[];
            if (Array.isArray(maybe?.data)) return maybe.data as TestimonialItem[];
            return [] as TestimonialItem[];
        },
    });