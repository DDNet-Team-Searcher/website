type OwnProps = {
    children: React.ReactNode;
};

export function Step({ children }: OwnProps) {
    return <div className="min-w-full">{children}</div>;
}
