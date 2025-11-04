
import { useGetFeature } from '@/api/FeatureQueries';

const OmNamehShivaya = (): JSX.Element => {
    const { data } = useGetFeature();
    const multipurposeItem = (data as any)?.data?.find((item: any) => item.purpose === 'multipurpose');
    const isVideo = multipurposeItem?.fileUrl && (multipurposeItem.fileUrl.includes('.mp4') || multipurposeItem.fileUrl.includes('.webm') || multipurposeItem.fileUrl.includes('.avi'));
    return (
        <section className="relative w-full aspect-[1440/634] max-h-[90vh] overflow-hidden">
            {/* Dynamic Media */}
            {multipurposeItem && (
                isVideo ? (
                    <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop>
                        <source src={multipurposeItem.fileUrl} type="video/mp4" />
                    </video>
                ) : (
                    <img className="absolute inset-0 w-full h-full object-cover" src={multipurposeItem.fileUrl} alt="Multipurpose Media" />
                )
            )}

          
        </section>
    );
};

export default OmNamehShivaya; 