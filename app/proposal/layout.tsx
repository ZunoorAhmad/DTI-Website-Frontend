import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './proposal.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Centralizing the Admissions System of DTI | Visible Winner',
  description:
    'A business proposal from Visible Winner to Descon Technical Institute for a centralized digital admission management platform.',
};

export default function ProposalLayout({ children }: { children: ReactNode }) {
  return <div className={`${jakarta.className} proposal-root`}>{children}</div>;
}
