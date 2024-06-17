import '../../../assets/scss/page/about.scss';
import View from '../../common/view';
import ElementCreator from '../../util/element-creator';

import imgLogoSrc from '../../../assets/img/svg/logo.svg';
import imgLogoRsSrc from '../../../assets/img/svg/rs.svg';
import imgRinaSrc from '../../../assets/img/person/rina.png';
import imgPetrSrc from '../../../assets/img/person/petr.png';
import imgSvetaSrc from '../../../assets/img/person/sveta.png';

const imageSrc = {
  LOGO: `${imgLogoSrc}`,
  LOGORS: `${imgLogoRsSrc}`,
  RINA: `${imgRinaSrc}`,
  PETR: `${imgPetrSrc}`,
  SVETA: `${imgSvetaSrc}`,
};

export default class AboutPage extends View {
  constructor() {
    const params = {
      tag: 'div',
      classNames: ['container'],
    };
    super(params);
    this.setContent();
  }

  private setContent(): void {
    const infoText = this.infoGeneral();
    const persons = this.persons();
    this.viewElementCreator.addInnerElements([infoText, persons]);
  }

  private infoGeneral(): ElementCreator<HTMLElement> {
    const aboutWrapper = new ElementCreator({
      classNames: ['about-wrapper'],
    });

    const aboutLogoData = this.logo();
    const aboutInfoData = this.info();
    const aboutLogoRSData = this.logoRS();

    aboutWrapper.addInnerElements([aboutLogoData, aboutInfoData, aboutLogoRSData]);

    return aboutWrapper;
  }

  private logo(): ElementCreator<HTMLElement> {
    const aboutLogo = new ElementCreator({
      classNames: ['about__logo'],
    });

    const aboutLogoLink = new ElementCreator({
      tag: 'a',
      classNames: ['about__logo-link'],
      attributes: { href: '/' },
    });

    const imgLogo = new ElementCreator({
      tag: 'img',
      classNames: ['img-full'],
      attributes: {
        src: imageSrc.LOGO,
        alt: 'Логотип',
      },
    });

    const logoText = new ElementCreator({
      tag: 'p',
      textContent: 'Holy Grail',
    });

    aboutLogoLink.addInnerElements([imgLogo]);
    aboutLogo.addInnerElements([aboutLogoLink, logoText]);
    return aboutLogo;
  }

  private info(): ElementCreator<HTMLElement> {
    const aboutInfo = new ElementCreator({
      classNames: ['about__info'],
    });

    const title = new ElementCreator({
      textContent: 'About the project',
      classNames: ['title'],
    });

    const text = new ElementCreator({
      classNames: ['text'],
      textContent: `We are proud to present our application. Whether you are a novice or an experienced cyclist, you will be able to find your perfect bike and unlock the joy and freedom of riding.`,
    });

    const text2 = new ElementCreator({
      classNames: ['text'],
      textContent: `"Holy Grail" is a final studying assignment for the RSSchool JS/Front-end course, and its purpose is to design a detailed, true-to-life imitation of real e-commerce applications, where visitors could quickly and effortlessly browse, select, and order preferred products from the available range. Among the implemented features, the application includes customer registration and authorisation forms and a shop catalogue with filtering, sorting, and searching functions. Customers are able to view the detailed item descriptions or move to the product pages for more information, add the chosen items to the cart, and proceed to checkout to finalise their orders. The application is designed using Commercetools, one of the leading cloud-based commerce platforms.`,
    });

    aboutInfo.addInnerElements([title, text, text2]);

    return aboutInfo;
  }

  private logoRS(): ElementCreator<HTMLElement> {
    const aboutLogoRS = new ElementCreator({
      classNames: ['about__logo-rs'],
    });

    const logoRsLink = new ElementCreator({
      tag: 'a',
      classNames: ['logo-rs__link'],
      attributes: { href: 'https://rs.school/courses/javascript-ru' },
    });

    const imgLogoRS = new ElementCreator({
      tag: 'img',
      classNames: ['img-full'],
      attributes: {
        src: imageSrc.LOGORS,
        alt: 'logo rs',
      },
    });

    logoRsLink.addInnerElements([imgLogoRS]);
    aboutLogoRS.addInnerElements([logoRsLink]);

    return aboutLogoRS;
  }

  private persons(): ElementCreator<HTMLElement> {
    const persons = new ElementCreator({
      classNames: ['about__persons'],
    });

    const rina = this.person(
      'img__ver-1',
      imageSrc.RINA,
      'Ekaterina Kovaleva',
      'software developer',
      'github.com/asimo-git',
      `Formerly having a bachelor's degree in geology, at present Rina is a front-end wizard. A heart, a brain, common sense and steel nerves of the project, bringing a lot of determination and expertise to the team's work. A truly SDK goddess, ruling API integrations and interactions. The one with all the answers, who seems to not have the word 'impossible' in her vocabulary.`
    );

    const petr = this.person(
      'img__ver-2',
      imageSrc.PETR,
      'Petr Fadeev',
      'UI/UX Designer',
      'github.com/vladimirovicp',
      'Top performing IT professional with 10 years’ successful experience in Information Technology field.Proficient in hardware and software maintenance. Solid track record of providing the timely positive response to requests regarding computer-related assistance. A deep understanding of the general organizational confidentiality policies associated with IT specialist position.'
    );

    const sveta = this.person(
      'img__ver-3',
      imageSrc.SVETA,
      'Svetlana Vorokhobina',
      'Team Lead',
      'github.com/svorokhobina',
      'Top performing IT professional with 10 years’ successful experience in Information Technology field.Proficient in hardware and software maintenance. Solid track record of providing the timely positive response to requests regarding computer-related assistance. A deep understanding of the general organizational confidentiality policies associated with IT specialist position.'
    );

    persons.addInnerElements([rina, petr, sveta]);
    return persons;
  }

  private person(
    classPersonImgWraper: string,
    urlPhoto: string,
    namePerson: string,
    rolePerson: string,
    urlGitHub: string,
    text: string
  ): ElementCreator<HTMLElement> {
    const person = new ElementCreator({ classNames: ['about__person'] });
    const personImgWraper = new ElementCreator({
      classNames: ['about__person-img', classPersonImgWraper],
    });
    const personImg = new ElementCreator({
      tag: 'img',
      classNames: ['img-full'],
      attributes: {
        src: urlPhoto,
        alt: '',
      },
    });
    personImgWraper.addInnerElements([personImg]);
    const content = new ElementCreator({
      classNames: ['about__person-content'],
    });
    const title = this.personTitle(namePerson, rolePerson);
    const github = this.personGit(urlGitHub);

    const infoText = new ElementCreator({
      classNames: ['about__person-info'],
      textContent: text,
    });
    content.addInnerElements([title, github, infoText]);
    person.addInnerElements([personImgWraper, content]);
    return person;
  }

  private personTitle(namePerson: string, rolePerson: string): ElementCreator<HTMLElement> {
    const title = new ElementCreator({
      classNames: ['about__person-title'],
    });
    const name = new ElementCreator({
      classNames: ['name'],
      textContent: namePerson,
    });

    const role = new ElementCreator({
      classNames: ['role'],
      textContent: rolePerson,
    });
    title.addInnerElements([name, role]);

    return title;
  }

  private personGit(urlGitHub: string): ElementCreator<HTMLElement> {
    const github = new ElementCreator({
      classNames: ['about__person-github'],
    });
    const githubLink = new ElementCreator({
      tag: 'a',
      attributes: { href: `https://${urlGitHub}` },
      textContent: urlGitHub,
    });
    github.addInnerElements([githubLink]);
    return github;
  }
}
