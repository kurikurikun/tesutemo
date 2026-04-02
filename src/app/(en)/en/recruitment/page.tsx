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
      heroTitle={<>Attract more of the candidates you want with <span className="text-primary">real employee voices.</span></>}
      heroSubtitle={
        <>
          <p className="italic text-gray-800 font-semibold mb-3">
            Let the employees who chose you, convince the candidates considering you.
          </p>
          <p>
            <span className="text-primary font-semibold">Authentic</span>, <span className="text-primary font-semibold">affordable</span> recruitment videos that resonate with the candidates you want to hire.
          </p>
        </>
      }
      heroVideoUrl={v('1177652915', 'be43651176')}
      problemHeading={<>You&rsquo;re hiring.<br />But the right candidates aren&rsquo;t applying.</>}
      problemSubheading="Do any of these sound familiar?"
      problems={[
        "You'd love more quality employee testimonials, but the budget just isn't there",
        'You have a careers site, but candidates never seem to find it',
        'You know you need to be on social media, but you never have content worth posting',
        "Your team is stretched thin, and consistent content creation just doesn't happen",
        'You need content fast, but traditional video production takes weeks',
      ]}
      problemConclusion={<>The result? You&rsquo;re not getting the right applicants — and the ones you do hire aren&rsquo;t always the right fit.</>}
      solutionTitle="TesuTemo lets real employees do the talking"
      solutionSubtitle={<>We interview your employees and turn their genuine stories<br />into content that attracts the candidates you actually want</>}
      solutionPoints={['Content that gives candidates a real feel for your culture — and helps the right ones decide to apply']}
      videoSectionTitle="When employees speak, candidates listen."
      videoSectionSubtitle="Interview Videos (Horizontal: 90–120 sec / Vertical: 30–60 sec)"
      videoHorizontalDesc={<>Horizontal videos go deep — perfect for your <span className="text-primary font-bold">careers page and recruitment events</span></>}
      videoVerticalDesc={<>Vertical videos get you <span className="text-primary font-bold">discovered on social media</span></>}
      onlineFeatures={[
        { title: 'Employees film from wherever they are', desc: 'No studio, no stress. Employees speak to us on their own phone, in their own space — and the authenticity shows.' },
        { title: 'Pro-quality video, no crew required', desc: 'One free app, no login — employees just tap the call link we send. The tech handles audio and video quality automatically.' },
        { title: 'Built for the platforms candidates actually use', desc: 'Every video is cut and formatted for the feeds where your target candidates actually spend their time — ready to post, ready to perform.' },
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
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              The TesuTemo Effect. Here&rsquo;s What Changes.
            </h2>
            <p className="text-lg text-gray-600">Here&rsquo;s how TesuTemo transforms your recruitment strategy</p>
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
