{
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

  'use strict';
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
      const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
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
            const tagHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
            html = html + tagHTML + ' ';
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

    let allTagsHTML = '';

    for(let tag in allTags){
      allTagsHTML += '<li><a href="#tag-' + tag + '" class="' + opts.cloudClassPrefix + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + /*' (' + allTags[tag] + ') ' +*/ '</a></li>';
    }

    tagList.innerHTML = allTagsHTML;
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

      const authorHTML = '<p class="post-author">by <a href="#author-' + author + '">' + author + '</a></p>';

      html = html + authorHTML;

      authorWrapper.innerHTML = html;

      if(!allAuthors[author]){
        allAuthors[author] = 1;
      } else {
        allAuthors[author]++;
      }
    }

    const authorsList = document.querySelector(opts.authorsListSelector);

    let allAuthorsHTML = '';

    for(let author in allAuthors){
      allAuthorsHTML += '<li><a href="#author-' + author + '">' + author + ' (' + allAuthors[author] + ') ' + '</a></li>';
    }

    authorsList.innerHTML = allAuthorsHTML;
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
