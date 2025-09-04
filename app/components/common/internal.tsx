interface Properties {
    title?: string;
    children: React.ReactNode;
}

export default function InternalPage({ title, children }: Properties) {
    return (
        <main className="min-h-[calc(100vh-111px)] py-4">
            <h1 className="block w-340 mx-auto mt-24 text-4xl text-center font-semibold select-none max-[700px]:w-full max-[700px]:px-3">{title}</h1>
            {children}
        </main>
    );
}

export function PageSection({ title, children }: Properties) {
    return (
        <section className="w-340 mx-auto mt-5 max-[700px]:w-full max-[700px]:px-3">
            {title?.length ? <h2 className="text-xl font-semibold mb-2">{title}</h2> : null}
            <div className="text-sm text-gray-400/80 leading-relaxed">{children}</div>
        </section>
    );
}