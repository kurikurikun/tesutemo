import type { Metadata } from 'next';
import SubpageLayout from '@/components/SubpageLayout';

export const metadata: Metadata = {
  title: 'Customer Testimonial Videos & Case Study Videos | TesuTemo',
  description:
    'Customer interview videos that address prospect concerns and drive purchase decisions. Deliver the true value of your product or service through trusted third-party voices.',
  alternates: {
    canonical: 'https://www.tesutemo.co/en/case-study',
    languages: { ja: 'https://www.tesutemo.co/case-study' },
  },
};

const v = (id: string, h?: string) =>
  `https://player.vimeo.com/video/${id}?${h ? `h=${h}&` : ''}badge=0&autopause=0&player_id=0&app_id=58479`;

export default function CaseStudyPage() {
  return (
    <SubpageLayout
      locale="en"
      currentPath="/en/case-study"
      heroTitle={
        <>
          Real customer voices become your strongest sales tool.
          <br /><span className="text-primary">Customer Testimonial Interview Video</span> Service
        </>
      }
      heroSubtitle="Real customer interviews that deliver the true value of your product or service"
      heroVideoUrl={v('1017754838', '2df374323e')}
      problemHeading="Promoting your product, but not being chosen"
      problemSubheading={<>Your company is putting information out there,<br />but are you experiencing these challenges?</>}
      problems={[
        'The appeal of your product or service is not getting through',
        'Review site ratings alone are not building enough trust',
        'Your points of differentiation from competitors are not coming across',
        'Your conversion rate has plateaued',
        'You are not leveraging existing customer satisfaction to win new customers',
      ]}
      problemConclusion={<>As a result,<br />the true value of your product or service is not communicated, and you are missing customer acquisition opportunities.</>}
      solutionTitle="TesuTemo communicates through real voices"
      solutionSubtitle={<>Through customer interviews,<br />we make the true value of your product or service visible</>}
      solutionPoints={['Content that helps prospects decide if your solution is the right fit for them']}
      videoSectionTitle="Real voices change purchase decisions"
      videoSectionSubtitle="Interview Videos (Horizontal: 90-120 sec / Vertical: 30-60 sec)"
      videoHorizontalDesc={<>Horizontal videos are for <span className="text-primary font-bold">&ldquo;telling your story in depth&rdquo;</span> on websites and at events</>}
      videoVerticalDesc={<>Vertical videos are for <span className="text-primary font-bold">&ldquo;getting discovered&rdquo;</span> on social media</>}
      onlineFeatures={[
        { title: 'Filmed in their own environment', desc: 'By speaking into their own smartphone, customers are relaxed and share genuinely authentic feedback' },
        { title: 'High-quality recording via dedicated software', desc: 'Our proprietary software requires no login or sign-up, maintaining audio and video quality while eliminating the need for on-site filming and keeping costs low' },
        { title: 'Optimized for customer channels', desc: 'Content tailored for the social media platforms that your target customers use every day' },
      ]}
      horizontalVideos={[
        v('1019675789', '8ca81d7847'),
        v('1082523091'),
        v('1049154514'),
        v('1019649377'),
      ]}
      verticalVideos={[
        v('1020046986'),
        v('1049144140'),
        v('1169470823'),
      ]}
    />
  );
}
