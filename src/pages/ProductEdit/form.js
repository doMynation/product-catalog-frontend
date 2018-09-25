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
  name: {
    label: "Nom",
    init: product => product.description.name,
    validators: [required],
    checkError: true
  },
  shortDescription: {
    label: "Description (Courte)",
    init: product => product.description.shortDescription,
    checkError: true
  },
  longDescription: {
    label: "Description (Longue)",
    init: product => product.description.longDescription,
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
  },
  costPrice: {
    label: "Prix coûtant",
    init: product => Number(product.costPrice).toFixed(2),
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
    }))
  }
};
