module.exports = ({ env }) => ({
  // ...
  seo: {
    enabled: true,
  },
  "drag-drop-content-types": {
    enabled: true,
  },
  "strapi-plugin-populate-deep": {
    config: {
      defaultDepth: 5, // Default is 5
    },
  },
});
