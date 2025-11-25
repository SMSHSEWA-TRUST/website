import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { SectionLoader } from '@/components/ui/LoadingComponents';
import { useGetPrasadById } from '@/api/PrasadQueries';
const PrashadDetailCard = React.lazy(() => import('@/components/prashad/PrashadDetailCard'));
import ImportantParshad from '@/components/prashad/ImportantParshad';
import Bestseller from '@/components/prashad/Bestseller';
import ItemInBox from '@/components/prashad/ItemInBox';
import PrashadFaq from '@/components/prashad/PrashadFaq';
import YouMightLike from '@/components/prashad/YouMightLike';

type Params = {
    id?: string;
};

const ParshadDetailPage: React.FC = () => {
    const { id } = useParams<Params>();

    // Build a minimal `plan` object so the component can derive the id
    const plan = id
        ? (() => {
            const parsed = Number(id);
            const numericId = Number.isFinite(parsed) ? parsed : 0;
            return {
                _id: id,
                id: numericId,
                name: '' as string,
                price: 0 as number,
            };
        })()
        : null;



    // Fetch detailed prasad data
    const prasadId = id || '';
    const { data: prasadDetails } = useGetPrasadById(prasadId, !!prasadId);
    const itemsIncluded = prasadDetails?.data?.itemsIncluded;

    return (
        <div className='w-full'>
            <Suspense fallback={<SectionLoader />}>
                <PrashadDetailCard plan={plan} />
            </Suspense>



            {/* Bestseller Section */}
            <Suspense fallback={<SectionLoader />}>
                <Bestseller />
            </Suspense>


            {/* Important Parshad Section */}
            <Suspense fallback={<SectionLoader />}>

                <ImportantParshad />
            </Suspense>

            {/* Item In Box Section */}
            <Suspense fallback={<SectionLoader />}>
                <ItemInBox items={itemsIncluded} />
            </Suspense>



            {/* You Might Like Section */}
            <Suspense fallback={<SectionLoader />}>
                <YouMightLike />
            </Suspense>

            {/* Prashad FAQ Section */}
            <Suspense fallback={<SectionLoader />}>
                <PrashadFaq />
            </Suspense>
        </div>
    );
};

export default ParshadDetailPage;
