import Link from "next/link";
import InternalPage, { PageSection } from "@/app/components/common/internal";

export default function About() {
    return (
        <InternalPage title="About Collate">
            <PageSection title="What is Collate?">
                <p>Collate is an AI search and summarisation engine designed to quickly deliver information, without clutter or inaccuracy. Leveraging the latest deep learning models, Collate provides a clean and efficient means of browsing the web.</p>
                <br/>
                <p>Collate was developed and is maintained by <Link href="https://harveycoombs.com" target="_blank" rel="noopener" className="font-medium hover:underline">Harvey Coombs</Link>.</p>
            </PageSection>
        </InternalPage>
    );
}