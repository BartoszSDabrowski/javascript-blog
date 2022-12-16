{
  'use strict';

  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorListLink: Handlebars.compile(document.querySelector('#template-author-list-link').innerHTML)
  }

  const opts = {
    articleSelector: '.post',
    titleSelector: '.post-title',
    titleListSelector: '.titles',
    articleTagsSelector: '.post-tags .list',
    articleAuthorSelector: '.post .post-author',
    tagsListSelector: '.tags.list',
    cloudClassCount: 5,
    cloudClassPrefix: 'tag-size-',
    authorsListSelector: '.authors.list'
  }

  const titleClickHandler = function(event){
    event.preventDefault();

    const clickedElement = this;

    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }

    clickedElement.classList.add('active');

    const activeArticles = document.querySelectorAll('.post.active');

    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }

    const articleSelector = clickedElement.getAttribute('href');

    const targetArticle = document.querySelector(articleSelector);

    targetArticle.classList.add('active');
  };

  function generateTitleLinks(customSelector = ''){
    const titleList = document.querySelector(opts.titleListSelector);

    titleList.innerHTML = '';

    let articles = document.querySelectorAll(opts.articleSelector + customSelector);

    let html = '';

    for(let article of articles){
      const articleId = article.getAttribute('id');
      const articleTitle = article.querySelector(opts.titleSelector).innerHTML;
      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);
      html = html + linkHTML;
    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');

    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  }

  generateTitleLinks();

  function calculateTagsParams(tags){
    const params = {
      max: 0,
      min: 999999
    }

    for(let tag in tags){
      if(tags[tag] > params.max){
        params.max = tags[tag];
      }

      if(tags[tag] < params.min){
        params.min = tags[tag];
      }
    }

    return params;
  }

  calculateTagsParams();

  function calculateTagClass(count, params){
    const normalizedCount = count - params.min;

    const normalizedMax = params.max - params.min;

    const percentage = normalizedCount / normalizedMax;

    const classNumber = Math.floor(percentage * (opts.cloudClassCount - 1) + 1);

    return classNumber;
  }

  function generateTags(){
    let allTags = {};

    const articles = document.querySelectorAll(opts.articleSelector);

    for(let article of articles){
        const tagsWrapper = article.querySelector(opts.articleTagsSelector);

        let html = '';

        const articleTags = article.getAttribute('data-tags');

        const articleTagsArray = articleTags.split(' ');

        for(let tag of articleTagsArray){
          const linkHTMLData = {id: tag, title: tag};

          const linkHTML = templates.tagLink(linkHTMLData);
            html = html + linkHTML + ' ';
            if(!allTags[tag]){
              allTags[tag] = 1;
            } else {
              allTags[tag]++;
            }
        }

        tagsWrapper.innerHTML = html;
    }

    const tagList = document.querySelector(opts.tagsListSelector);

    const tagsParams = calculateTagsParams(allTags);
    console.log('tagsParams:', tagsParams)

    const allTagsData = {tags: []};

    for(let tag in allTags){
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
    }

    tagList.innerHTML = templates.tagCloudLink(allTagsData);
  }

  generateTags();

  function tagClickHandler(event){
    event.preventDefault();

    const clickedElement = this;

    const href = clickedElement.getAttribute('href');

    const tag = href.replace('#tag-', '');

    const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

    for(let activeTag of activeTags){
        activeTag.classList.remove('active');
    }

    const allTags = document.querySelectorAll('a[href="' + href + '"]');

    for(let singleTag of allTags){
        singleTag.classList.add('active');
    }

    generateTitleLinks('[data-tags~="' + tag + '"]');
  }

  function addClickListenersToTags(){
    const tagLinks = document.querySelectorAll('.post-tags .list a');

    for(let tagLink of tagLinks){
        tagLink.addEventListener('click', tagClickHandler);
    }
  }

  addClickListenersToTags();

  function generateAuthors(){
    let allAuthors = {};

    const articles = document.querySelectorAll(opts.articleSelector);

    for(let article of articles){
      const authorWrapper = article.querySelector(opts.articleAuthorSelector);

      let html = '';

      const author = article.getAttribute('data-authors');

      const linkHTMLData = {id: author, title: author};
      const linkHTML = templates.authorLink(linkHTMLData);

      html = html + linkHTML;

      authorWrapper.innerHTML = html;

      if(!allAuthors[author]){
        allAuthors[author] = 1;
      } else {
        allAuthors[author]++;
      }
    }

    const authorsList = document.querySelector(opts.authorsListSelector);

    const allAuthorsData = {authors: []};

    for(let author in allAuthors){
      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
      });
    }

    authorsList.innerHTML = templates.authorListLink(allAuthorsData);
  }

  generateAuthors();

  function authorClickHandler(event){
    event.preventDefault();

    const clickedElement = this;

    const href = clickedElement.getAttribute('href');

    const author = href.replace('#author-', '');

    const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');

    for(let activeAuthor of activeAuthors){
      activeAuthor.classList.remove('active');
    }

    const allAuthors = document.querySelectorAll('a[href="' + href + '"]');

    for(let singleAuthor of allAuthors){
      singleAuthor.classList.add('active');
    }

    generateTitleLinks('[data-authors="' + author + '"]');
  }

  function addClickListenersToAuthors(){
    const authorLinks = document.querySelectorAll('.post-author a');

    for(let authorLink of authorLinks){
      authorLink.addEventListener('click', authorClickHandler);
    }
  }

  addClickListenersToAuthors();
}
