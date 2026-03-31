import type { Metadata } from 'next';
import SubpageLayout from '@/components/SubpageLayout';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Employee Interview Videos for Recruitment | TesuTemo',
  description:
    'Employee interview videos that resonate with job seekers and eliminate hiring mismatches. Real voices convey workplace culture and job satisfaction through affordable recruitment video promotion.',
  alternates: {
    canonical: 'https://www.tesutemo.co/en/recruitment',
    languages: { ja: 'https://www.tesutemo.co/recruitment' },
  },
};

const v = (id: string, h?: string) =>
  `https://player.vimeo.com/video/${id}?${h ? `h=${h}&` : ''}badge=0&autopause=0&player_id=0&app_id=58479`;

export default function RecruitmentPage() {
  return (
    <SubpageLayout
      locale="en"
      currentPath="/en/recruitment"
      heroTitle={
        <>
          Transform hiring with real employee voices.
          <br /><span className="text-primary">Employee Interview Video</span> Service
        </>
      }
      heroSubtitle={
        <>
          <span className="text-primary font-semibold">Authentic voices</span> that resonate with job seekers
          <br />
          <span className="text-primary font-semibold">Affordable</span> video promotion for recruitment
        </>
      }
      heroVideoUrl={v('1177652915', 'be43651176')}
      problemHeading="Posting jobs, but not getting applicants"
      problemSubheading={<>Your company is putting information out there,<br />but are you experiencing these challenges?</>}
      problems={[
        'You want to share real employee voices, but your budget is limited',
        'You built a careers site, but candidates never find it',
        'You know social media matters, but you lack compelling content',
        'With limited staff, consistent content creation is difficult',
        'You need content fast, but traditional video production takes too long',
      ]}
      problemConclusion={<>As a result,<br />you are not attracting the right number and type of applicants, leading to hiring mismatches.</>}
      solutionTitle="TesuTemo communicates through real voices"
      solutionSubtitle={<>Through employee interviews,<br />we make your company&rsquo;s true appeal visible</>}
      solutionPoints={['Content that helps candidates vividly picture what it is like to work at your company']}
      videoSectionTitle="Real voices change hiring decisions"
      videoSectionSubtitle="Interview Videos (Horizontal: 90-120 sec / Vertical: 30-60 sec)"
      videoHorizontalDesc={<>Horizontal videos are for <span className="text-primary font-bold">&ldquo;telling your story in depth&rdquo;</span> on career sites and at recruitment events</>}
      videoVerticalDesc={<>Vertical videos are for <span className="text-primary font-bold">&ldquo;getting discovered&rdquo;</span> on social media</>}
      onlineFeatures={[
        { title: 'Filmed in their own environment', desc: 'By speaking into their own smartphone, interviewees are relaxed and share genuinely authentic stories' },
        { title: 'High-quality recording via dedicated software', desc: 'Our proprietary software requires no login or sign-up, maintaining audio and video quality while eliminating the need for on-site filming and keeping costs low' },
        { title: 'Optimized for candidate channels', desc: 'Content tailored for the social media platforms that your target job seekers use every day' },
      ]}
      horizontalVideos={[
        v('1177653343', 'ddc7b19cbb'),
      ]}
      verticalVideos={[
        v('1177647609', 'fb5b66c157'),
        v('1177647513', 'd517b6f9ed'),
        v('1177647574', 'c1311764fd'),
      ]}
    >
      {/* How TesuTemo videos are used in recruitment */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#e8e5f5] to-[#f0eef8] rounded-2xl py-8 px-6 mb-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              How TesuTemo Videos<br />Are Used in Recruitment
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                num: '\u2460',
                title: 'Social Media',
                points: [
                  'Connect with target candidates who get their information from social media.',
                  'A powerful tool for gaining broad engagement.',
                  'Interview videos are inherently shareable, driving organic reach on social platforms.',
                ],
              },
              {
                num: '\u2461',
                title: 'Recruitment Events',
                points: [
                  'Visually convey your company culture, atmosphere, and work environment to leave a lasting impression on candidates.',
                  'Differentiate your company from competitors.',
                  'Capture candidate interest quickly in a short time.',
                  'Help candidates form a concrete image of what it is like to work at your company.',
                ],
              },
              {
                num: '\u2462',
                title: 'Company Careers Page',
                points: [
                  'Convey the real atmosphere and culture of your company, building trust and boosting application rates.',
                  'Strengthen your employer brand.',
                  'Communicate workplace environment, employee expressions, and enthusiasm intuitively.',
                ],
              },
              {
                num: '\u2463',
                title: 'Job Boards',
                points: [
                  'Support candidate decision-making when they are ready to apply.',
                  'Allow efficient comparison across various roles.',
                  'Major job boards are now incorporating short-form vertical videos into their platforms.',
                ],
              },
            ].map((item) => (
              <div key={item.num} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{item.num}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-primary mt-1">{item.title}</h3>
                </div>
                <ul className="space-y-3 ml-14">
                  {item.points.map((point, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span className="text-gray-700">&bull;</span>
                      <p className="text-gray-700 leading-relaxed">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Mynavi screenshot */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <p className="text-lg text-gray-700 font-semibold">Mynavi</p>
                <p className="text-sm text-gray-500 mt-1">*For illustrative purposes only (not our work)</p>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/mynavi-screenshot.png"
                  alt="Mynavi Short Movie Gallery"
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </SubpageLayout>
  );
}
