import cn from '@/utils/class-names';

const Card = ({ className, children }: { className?: string; children: any }) => {
    return (
        <div className={cn(' m-2 p-4 md:m-4 rounded-lg bg-gray-100', className)}>
            {children}
        </div>
    );
};

export default Card;


