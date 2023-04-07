type OwnProps = {
    imageUrl: string;
    text: string;
};

export const AboutUsItem: React.FC<OwnProps> = ({ imageUrl, text }) => {
    return (
        <div className="mt-12 mx-2.5 border-[1px] border-primary-1 sm:max-w-[230px] w-full flex flex-col items-center rounded-[20px] text-high-emphasis bg-gradient-to-br from-[#312A22] to-[rgba(49,42,34,.2)]">
            <img src={imageUrl} className="-mt-12" alt="tee image" />
            <p className="mt-2.5 mx-6 mb-7">{text}</p>
        </div>
    );
};
