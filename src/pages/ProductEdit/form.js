import {required, sku} from '../../util/validators';

export default {
  sku: {
    label: "SKU",
    init: product => product.sku,
    validators: [required, sku],
    checkError: true
  },
  mpn: {
    label: "MPN",
    init: product => product.metadata.mpn,
    checkError: true
  },
  isKit: {
    label: "Ensemble de produits (Kit)",
    init: product => product.metadata.isKit === "1",
    format: value => value ? "Oui" : "Non",
  },
  isCustom: {
    label: "Produit sur mesure",
    init: product => product.isCustom,
    format: value => value ? "Oui" : "Non",
  },
  isEnabled: {
    label: "Produit activé",
    init: product => product.isEnabled,
    format: value => value ? "Oui" : "Non",
  },
  categoryId: {
    label: "Catégorie",
    validators: [required],
    init: product => product.categoryId
  },
  departmentId: {
    label: "Département",
    init: product => product.department ? product.department.id : ""
  },
  price: {
    label: "Prix de détail",
    validators: [required],
    init: product => Number(product.price).toFixed(2),
    export: v => parseFloat(v)
  },
  costPrice: {
    label: "Prix coûtant",
    init: product => Number(product.costPrice).toFixed(2),
    export: v => parseFloat(v)
  },
  tags: {
    label: "Tags",
    init: product => product.tags,
    format: value => {
      const sorted = [...value].sort();

      return sorted.join(", ");
    }
  },
  attributes: {
    label: "Attributs",
    init: product => product.attributes.map(productAttr => ({
      id: productAttr.attribute.id,
      value: productAttr.isReference ? productAttr.valueId : productAttr.value,
      isEditable: productAttr.isEditable,
    })),
    export: v => v.map(item => ({...item, value: item.value + ''}))
  },
  translations: {
    label: "Traductions",
    validators: [translations => {
      return translations.reduce((acc, tr, key) => {
        if (tr.name.trim() === "") {
          acc[key] = "Obligatoire";
        }

        return acc;
      }, []);
    }],
    init: product => product.translations.map(translation => ({
      id: translation.id,
      lang: translation.lang,
      name: translation.description.name,
      shortDescription: translation.description.shortDescription,
      longDescription: translation.description.longDescription,
      isDefault: translation.isDefault
    })),
  },
  children: {
    label: "Children",
    validators: [children => {
      // @todo
      return "";
    }],
    init: product => product.children,
    export: v => v.map(child => ({
      productId: child.product.id,
      childType: child.childType,
      quantity: child.quantity,
      isVisible: child.isVisible,
      isCompiled: child.isCompiled,
    }))
  },
  imageUrl: {
    label: "Image",
    init: product => product.metadata.imageUrl,
  },
  extrusionId: {
    label: "Extrusion",
    init: product => product.metadata.extrusionId ? product.metadata.extrusionId : "",
  },
  stickerId: {
    label: "Étiquette",
    init: product => product.metadata.stickerId && product.metadata.stickerId !== "0" ? product.metadata.stickerId : "",
  },
};
