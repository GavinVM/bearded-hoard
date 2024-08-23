<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/GavinVM/mr-tracker">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Mr Tracker</h3>

  <p align="center">
    Simple APP to track your Bluray/4k Collection
    <br />
    ·
    <a href="https://github.com/GavinVM/mr-tracker/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/GavinVM/mr-tracker/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

I collect and have a reasonable collection of Blu-rays and more recent years 4K Blu-rays. I like to go to shops like CEX or charities to find re-owned titles to pad out or complete my current collection. However, it has got to the point where I am struggling to remember what I have, especially in terms of series of films like Fast and Furious.

To combat this, I came up with this app to track what I have. At the same time, I wanted to have something to show in my portfolio to potential employers.

It is a simple PWA app that allows the user to search for a title and add it to their list, which is viewable in either an icon or title list. There is also a tab that returns a list of current titles available in the CEX website webuy that are below a predefined value for informational purposes.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Angular][Angular.io]][Angular-url]
* [![Typscript][TypeScript.ts]][TypeScript-url]
* [![Ionic][ionic.com]][Ionic-url]
* [![Firebase][Firebase.cloud]][Firebase-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```
* ionic
  ```sh
  npm install -g @ionic/cli
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/GavinVM/mr-tracker.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Run Code locally
    ```sh
   ng s or ng serve
   ```
4. Build package
   ```sh
   ionic build --prod
   ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Future Feature

Here are enhoncements and changes I hoping to make that were not important in the initial creation and usage but will add to the utility to it. 

- [ ] Cex Tab
  - [ ] Options for search criteria
  - [ ] Use results to create a basket on CEX website 
- [ ] Add Tab
  - [ ] More formats eg DVD, VHS etc
  - [ ] Filter results if large data sets are returned
- [ ] Tracker Tab
  - [ ] tabable title to show information on title
  - [ ] intergrate with just watch or stick with TMDB to get where this title could be streamed

See the _backlog to follow_ for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Demonstrating

**This project was both a tool I could used at home but was also a chance to add to my profolio demonstrating my abilities as a developer to create a simple web app that can work on a mobile device and carries out straight forward CRUD actions** 

Below are key points linked with the process I went through to create this project: 

- First time using Ionic as a UI-framework, found it straightforward in most cases but tricky in others, like component select. It required more setup for programmatic interaction.  
  - For example, filter options in the cex tab: the select there has a setup value, but if you want to clear it to the default via the button in that view, a secondary setup was needed.
- The reason for using Ionic was to create a mobile app and from that desire, the idea of creating a Progressive Web App came. This implementation was new to me, so getting to grips with service workers, service workers, and the manifest file was completely new and found it a fun challenge.
- I also wanted to have it accessible like a "real" app, so I went with Firebase, which was recommended and had a guide in Ionic. It was new to me, so I kept the theme going of trying new tech.  
  - Other solutions I explored were standard hosting via a provider, like where the domain is hosted or AWS EC2, and static S3 storage.
- Having prior experience with Angular in my current job role, that aspect was straightforward. However, real challenges I faced were with the Add tab and the Cex tab specifically, in terms of how I wanted to present the data and the sources, which were all API calls. This resulted in learning how to stack and effectively chain them together.  
  - For example, when search is triggered in the Add tab and the result returns TV results, it finds out what season there are and splits them up and returns each season individually and as a box set. The information about the seasons was from a different API call and relied on another for search ID.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Choose an Open Source License](https://choosealicense.com)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template?tab=readme-ov-file)
* [TMDB API](https://developer.themoviedb.org/docs/getting-started)
* [CEX - uk.webuy](https://uk.webuy.com/)
* [Img Shields](https://shields.io)
* [Simple Icons](https://simpleicons.org/)
* [ngx-device-detector](https://www.npmjs.com/package/ngx-device-detector)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Gavin MItchell  - gavin.v.mitchell@hotamil.co.uk

Project Link: [https://github.com/GavinVM/mr-tracker](https://github.com/GavinVM/mr-tracker)

<p align="right">(<a href="#readme-top">back to top</a>)</p>





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/GavinVM/mr-tracker.svg?style=for-the-badge
[contributors-url]: https://github.com/GavinVM/mr-tracker/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/GavinVM/mr-tracker.svg?style=for-the-badge
[forks-url]: https://github.com/GavinVM/mr-tracker/network/members
[stars-shield]: https://img.shields.io/github/stars/GavinVM/mr-tracker.svg?style=for-the-badge
[stars-url]: https://github.com/GavinVM/mr-tracker/stargazers
[issues-shield]: https://img.shields.io/github/issues/GavinVM/mr-tracker.svg?style=for-the-badge
[issues-url]: https://github.com/GavinVM/mr-tracker/issues
[license-shield]: https://img.shields.io/github/license/GavinVM/mr-tracker.svg?style=for-the-badge
[license-url]: https://github.com/GavinVM/mr-tracker/blob/master/LICENSE
[product-screenshot]: images/screenshot.png
[Firebase.cloud]: https://img.shields.io/badge/Firebase-5f6368?style=for-the-badge&logo=firebase&logoColor=DD2C00
[Firebase-url]: https://firebase.google.com/
[TypeScript.ts]: https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://typescript.org/
[Ionic.com]: https://img.shields.io/badge/Ionic-white?style=for-the-badge&logo=ionic&logoColor=black
[Ionic-url]: https://ionicframework.com/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
 
