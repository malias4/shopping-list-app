import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          header: {
            appName: "ShoppingList",
            selectUser: "Select User",
          },
          itemList: {
            addItem: "Add Item",
            edit: "Edit",
            notResolvedOnly: "Not Resolved",
            allItems: "All",
            counter_zero: "No items",
            counter_one: "1 item",
            counter_few: "{{count}} items",
            counter_other: "{{count}} items",
            resolved: "Resolved",
            unresolved: "Unresolved",
          },
          overview: {
            create: "Create",
            yourLists: "Your Shopping Lists",
            showActive: "Active",
            showArchived: "Archived",
            noLists: "We couldn't find any lists",
          },
          itemActions: {
            archive: "Archive",
            delete: "Delete",
          },
          item: {
            check: "Check",
            uncheck: "Uncheck",
            remove: "Remove",
            newItem: "New Item",
          },
          memberActions: {
            addMember: "Add Member", // Added translation
            leave: "Leave", // Added translation
          },
          errors: {
            noCode: "Something's gone wrong.",
            toDoListNotFound: "ToDoList does not exist.",
            failedToLoadList: "Failed to load shopping lists!",
          },
        },
      },
      cs: {
        translation: {
          header: {
            appName: "NákupníList",
            selectUser: "Uživatel",
          },
          itemList: {
            addItem: "Přidat",
            edit: "Upravit",
            notResolvedOnly: "Nevyřešené",
            allItems: "Všechny",
            counter_zero: "Žádná položka",
            counter_one: "1 položka",
            counter_few: "{{count}} položky",
            counter_other: "{{count}} položek",
            resolved: "Vyřešené",
            unresolved: "Nevyřešené",
          },
          overview: {
            create: "Vytvořit",
            yourLists: "Vaše nákupní seznamy",
            showActive: "Aktivní",
            showArchived: "Archivované",
            noLists: "Nenašli jsme žádné seznamy",
          },
          itemActions: {
            archive: "Archivovat",
            delete: "Smazat",
          },
          item: {
            check: "Hotovo",
            uncheck: "Obnovit",
            remove: "Vymazat",
            newItem: "Nová položka",
          },
          memberActions: {
            addMember: "Přidat uživatele", // Added translation
            leave: "Odejít", // Added translation
          },
          errors: {
            noCode: "Něco se nepovedlo.",
            toDoListNotFound: "ToDoList neexistuje.",
            failedToLoadList: "Nepodařilo se načíst přehled listů!",
          },
        },
      },
    },
  });

export default i18n;
