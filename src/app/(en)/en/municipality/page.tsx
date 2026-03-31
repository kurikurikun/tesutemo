import type { Metadata } from 'next';
import SubpageLayout from '@/components/SubpageLayout';

export const metadata: Metadata = {
  title: 'Migration Promotion Videos & Resident Interview Videos | TesuTemo',
  description:
    'Interview videos of past migrants that resonate with potential relocators, delivering the real appeal of your region. An affordable migration promotion video service for local governments.',
  alternates: {
    canonical: 'https://www.tesutemo.co/en/municipality',
    languages: { ja: 'https://www.tesutemo.co/municipality' },
  },
};

const v = (id: string, h?: string) =>
  `https://player.vimeo.com/video/${id}?${h ? `h=${h}&` : ''}badge=0&autopause=0&player_id=0&app_id=58479`;

export default function MunicipalityPage() {
  return (
    <SubpageLayout
      locale="en"
      currentPath="/en/municipality"
      heroTitle={
        <>
          Become the chosen destination with real migrant voices.
          <br /><span className="text-primary">Migration Promotion Interview Video</span> Service
        </>
      }
      heroSubtitle={
        <>
          <span className="text-primary font-semibold">Authentic voices</span> that resonate with potential relocators
          <br />
          <span className="text-primary font-semibold">Affordable</span> video promotion for migration
        </>
      }
      heroVideoUrl={v('1010426949', '34d0ad59fb')}
      problemHeading="Promoting your region, but not being chosen"
      problemSubheading={<>Your municipality is putting information out there,<br />but are you experiencing these challenges?</>}
      problems={[
        'You want to share real migrant voices, but your budget is limited',
        'You built a migration website, but people never find it',
        'You know social media matters, but you lack compelling content',
        'With limited staff, consistent content creation is difficult',
        'People see your pamphlets, but you want to drive them online',
      ]}
      problemConclusion={<>As a result,<br />your region&rsquo;s appeal is not fully communicated, leading to post-migration mismatches.</>}
      solutionTitle="TesuTemo communicates through real voices"
      solutionSubtitle={<>Through interviews with migrants and community members,<br />we make your region&rsquo;s true appeal visible</>}
      solutionPoints={['Content that helps potential relocators vividly picture life after moving']}
      videoSectionTitle="Real voices change migration decisions"
      videoSectionSubtitle="Interview Videos (Horizontal: 90-120 sec / Vertical: 30-60 sec)"
      videoHorizontalDesc={<>Horizontal videos are for <span className="text-primary font-bold">&ldquo;telling your story in depth&rdquo;</span> on migration websites and at events</>}
      videoVerticalDesc={<>Vertical videos are for <span className="text-primary font-bold">&ldquo;getting discovered&rdquo;</span> on social media</>}
      onlineFeatures={[
        { title: 'Filmed in their own environment', desc: 'By speaking into their own smartphone, interviewees are relaxed and share genuinely authentic stories' },
        { title: 'High-quality recording via dedicated software', desc: 'Our proprietary software requires no login or sign-up, maintaining audio and video quality while eliminating the need for on-site filming and keeping costs low' },
        { title: 'Optimized for relocator channels', desc: 'Content tailored for the social media platforms that potential relocators use every day' },
      ]}
      horizontalVideos={[
        v('1010823028', '680857e13b'),
        v('1050610140', 'a5b8353977'),
      ]}
      verticalVideos={[
        v('1015054920', 'aa8a72196a'),
        v('1013400453', '89cb5fd807'),
        v('1050617850', '2e4031d8bd'),
      ]}
      companyLabel="Municipality"
      companyPlaceholder="City/Town name"
    >
      {/* How TesuTemo transforms your promotion efforts */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              How TesuTemo Transforms Your Promotion Efforts
            </h2>
            <p className="text-lg text-gray-600">Here is how adopting TesuTemo changes your outreach and migration promotion</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Ready-to-use video assets', desc: 'Get vertical and horizontal video assets\nperfect for social media, migration fairs, and events' },
              { title: 'Reduced production effort', desc: 'Dramatically reduce production workload,\nlightening the burden on your team' },
              { title: 'Content that resonates', desc: 'Authentic voices are trusted by Gen Z and Gen Alpha, generating genuine engagement' },
              { title: 'Easy budget approval', desc: 'Affordable pricing and flexible plans make it easy to get internal approval' },
              { title: 'No on-site filming needed', desc: 'No need to travel for filming;\nimplemented at low cost regardless of distance' },
              { title: 'Stronger migration pathways', desc: 'Embed videos in pamphlets and migration websites\nto create pathways that lead to consultations and visits' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-4 h-4 bg-primary rounded-full flex-shrink-0 mt-1" />
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-600 ml-7 whitespace-pre-line">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SubpageLayout>
  );
}
