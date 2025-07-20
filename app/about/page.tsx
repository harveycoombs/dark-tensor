import Link from "next/link";
import InternalPage, { PageSection } from "@/app/components/common/Internal";

export default function About() {
    return (
        <InternalPage title="About Dark Tensor">
            <PageSection title="What is Dark Tensor?">
                Dark Tensor is an AI search and summarisation engine designed to quickly deliver information, without clutter or inaccuracy. Leveraging the latest deep learning models, Dark Tensor provides a clean and efficient means of browsing the web.
            </PageSection>

            <PageSection title="Who is behind Dark Tensor?">
                Dark Tensor was developed and is maintained by <Link href="https://harveycoombs.com" target="_blank" rel="noopener" className="font-medium hover:underline">Harvey Coombs</Link>.
            </PageSection>
        </InternalPage>
    );
}