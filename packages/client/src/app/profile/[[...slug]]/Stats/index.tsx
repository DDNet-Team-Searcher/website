import { Graph } from '@/components/Graph';

type OwnProps = {
    username: string;
};

export function Stats({ username }: OwnProps) {
    return (
        <section>
            <Graph username={username} />
        </section>
    );
}
