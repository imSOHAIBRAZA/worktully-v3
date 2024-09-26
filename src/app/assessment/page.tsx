import Assessment from "../shared/assessment/assessment";
import { getQuiz } from "@/actions/serverFunctions";
import { Suspense } from 'react'
const AssessmentPage = async ({ searchParams }) => {

    const res = await getQuiz(searchParams?.jobTitleId)



    return (
        <Suspense fallback={<p>Loading Quiz...</p>}>
            <Assessment data={res?.data} />
        </Suspense>
    )

}


export default AssessmentPage;