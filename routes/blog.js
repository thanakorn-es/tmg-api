module.exports = function (models) {  
  'use strict';
  return {
      /**
       * Blog Index
       * @param req
       * @param res
       */
      index: function(req, res) {
        models.Article.articlesForIndex();
      }
  }
};