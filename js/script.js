{
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

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post .post-author',
    optTagsListSelector = '.tags.list';

  function generateTitleLinks(customSelector = ''){
    const titleList = document.querySelector(optTitleListSelector);

    titleList.innerHTML = '';

    let articles = document.querySelectorAll(optArticleSelector + customSelector);

    let html = '';

    for(let article of articles){
      const articleId = article.getAttribute('id');
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;
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

  function generateTags(){
    let allTags = {};

    const articles = document.querySelectorAll(optArticleSelector);

    for(let article of articles){
        const tagsWrapper = article.querySelector(optArticleTagsSelector);
        let html = '';
        const articleTags = article.getAttribute('data-tags');
        const articleTagsArray = articleTags.split(' ');

        for(let tag of articleTagsArray){
            const tagHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
            html = html + tagHTML + ' ';

            if(!allTags[tag]){/
              allTags[tag] = 1;
            } else {
              allTags[tag]++;
            }

        }

        tagsWrapper.innerHTML = html;
    }

    const tagList = document.querySelector(optTagsListSelector);

    let allTagsHTML = '';

    for(let tag in allTags){
      allTagsHTML += '<a href="#tag-' + tag + '">' + tag + ' (' + allTags[tag] + ') ' + '</a>';
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
    const articles = document.querySelectorAll(optArticleSelector);

    for(let article of articles){
      const authorWrapper = article.querySelector(optArticleAuthorSelector);

      let html = '';

      const articleAuthor = article.getAttribute('data-authors');

      const authorHTML = '<p class="post-author">by <a href="#author-' + articleAuthor + '">' + articleAuthor + '</a></p>';

      html = html + authorHTML;

      authorWrapper.innerHTML = html;
    }
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
