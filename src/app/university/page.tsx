'use client';

import SubpageLayout from '@/components/SubpageLayout';

const vimeoBase = 'https://player.vimeo.com/video/';
const params = '?title=0&byline=0&portrait=0';

export default function UniversityPage() {
  return (
    <SubpageLayout
      heroTitle="大学の「ファン」である在学生の声で、次の学生を迎える"
      heroSubtitle="リアルな在学生インタビューで、大学の本当の魅力を高校生に届ける"
      heroVideoUrl={`${vimeoBase}1019675789?h=8ca81d7847${params}`}
      problemIntro="大学の学生募集における課題"
      problems={[
        'オープンキャンパスだけでは大学の魅力が十分に伝わらない',
        '高校生が入学後の生活をイメージできない',
        '他大学との差別化が難しく志願者が減少している',
        'パンフレットの情報と実際のキャンパスライフにギャップがある',
        '地方の高校生にリーチする手段が限られている',
      ]}
      solutionTitle="在学生のリアルな声が、次の学生を引き寄せる"
      solutionDesc="実際に通っている在学生のインタビュー動画を通じて、パンフレットでは伝わらないキャンパスライフの実感や学びの魅力をリアルに届けます。等身大の先輩の声が、受験生の不安を解消し入学への一歩を後押しします。"
      horizontalVideos={[
        `${vimeoBase}1019675789?h=8ca81d7847${params}`,
        `${vimeoBase}1014779536?h=2c4b22d316${params}`,
      ]}
      verticalVideos={[
        `${vimeoBase}1020046986${params}`,
        `${vimeoBase}1049144140${params}`,
        `${vimeoBase}1015054920${params}`,
      ]}
    />
  );
}
