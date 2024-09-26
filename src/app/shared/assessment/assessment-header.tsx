import Image from 'next/image';
import { siteConfig } from '@/config/site.config';
import { useRouter } from 'next/navigation';
import { Button } from "rizzui";
import { IoSaveOutline } from "react-icons/io5";

const AssessmentHeader = () => {

    const router = useRouter();

    const handleExit = () => {
        router.push('/profile'); 
        localStorage?.removeItem('quizStartTime');
    };

    return(
         <div className="flex justify-between items-center">
         <Image
             width={260}
             height={260}
             src={siteConfig.logo}
             alt={siteConfig.title}
             className="dark:invert"
             priority
         />

         <Button
             className="text-primary border border-primary"
             variant="outline" color="primary" rounded="pill"
             onClick={handleExit}>
             <IoSaveOutline
                 className="h-4 w-4 mr-2" />
             <span> Save and Exit</span>{" "}
         </Button>

     </div>
    )
}

export default AssessmentHeader;