const mongoose = require("mongoose");
const paginate = (schema) => {
  schema.statics.paginate = async function (filter, options) {
    let sort = '';
    if (options.sortBy) {
      const sortingCriteria = [];
      options.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'createdAt';
    }

    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 9;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;

    const findFilter = filter;
    for (const value in filter) {
      if (!mongoose.isValidObjectId(filter[value]) && (!['level'].includes(value))) {
        findFilter[value] = {$regex: filter[value], $options: 'i'}
      }
    }

    const countPromise = this.countDocuments(findFilter).exec();
    let docsPromise = this.find(findFilter).sort(sort).skip(skip).limit(limit);

    if (options.populate) {
      let populate = options.populate.split(',');
      populate.forEach((populateOption) => {
        let properties = populateOption.split('.');
        if (properties.length > 1) {
          docsPromise = docsPromise.populate(
            properties.reverse().reduce((a, b, i) => {
              let temp = {path: b};
              if (i === 1 && options.filter.hasOwnProperty(a)) {
                temp.populate = {path: a};
                Object.assign(temp.populate, options.filter[a]);
              } else temp.populate = a;
              if (options.filter && options.filter.hasOwnProperty(b)) Object.assign(temp, options.filter[b]);
              return temp;
            })
          );
        } else {
          let populate = {path: populateOption};
          if (options.filter && typeof options.filter === 'object') {
            if (options.filter.hasOwnProperty(populateOption)) Object.assign(populate, options.filter[populateOption]);
            else Object.assign(populate, options.filter)
          }
          docsPromise = docsPromise.populate(
            populate
          );
        }
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = paginate;
