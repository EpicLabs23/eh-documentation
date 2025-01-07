import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  img_src: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'EHM',
    img_src: 'img/ehm-logo.svg',
    description: (
      <>
        Epic Hosting Manager
      </>
    ),
  },
  {
    title: 'ECP',
    img_src: 'img/ecp-logo.svg',
    description: (
      <>
        Epic Control Panel 
      </>
    ),
  },
  {
    title: 'EB',
    img_src: 'img/full-el23.svg',
    description: (
      <>
        Epic Backup
      </>
    ),
  },
];

function Feature({title, img_src, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={img_src} role="img" style={{ height: '150px'}} />
      </div>
      {/* <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div> */}
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container" style={{marginTop: '3rem'}}>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
