"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const fast_xml_parser_1 = require("fast-xml-parser");
const prisma_1 = require("../lib/prisma");
const parser = new fast_xml_parser_1.XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    trimValues: true,
    isArray: (name) => ["BIBLEBOOK", "CHAPTER", "VERS"].includes(name), // ✅ selalu array
});
async function seed() {
    try {
        console.log("🚀 Start seeding...");
        const xmlPath = node_path_1.default.join(process.cwd(), "src/scripts/alkitab_TB.xml");
        const xmlFile = node_fs_1.default.readFileSync(xmlPath, "utf-8");
        const parsed = parser.parse(xmlFile);
        const books = parsed.XMLBIBLE.BIBLEBOOK;
        for (const book of books) {
            console.log(`📖 Processing ${book["@_bname"]}`);
            const createdBook = await prisma_1.prisma.bibleBook.create({
                data: {
                    bnumber: Number(book["@_bnumber"]),
                    name: book["@_bname"],
                },
            });
            // ✅ isArray di parser sudah menjamin ini selalu array
            const chapters = Array.isArray(book.CHAPTER)
                ? book.CHAPTER
                : [book.CHAPTER];
            for (const chapter of chapters) {
                const createdChapter = await prisma_1.prisma.chapter.create({
                    data: {
                        number: Number(chapter["@_cnumber"]),
                        bibleBookId: createdBook.id,
                    },
                });
                const verses = Array.isArray(chapter.VERS)
                    ? chapter.VERS
                    : [chapter.VERS];
                await prisma_1.prisma.verse.createMany({
                    data: verses.map((verse) => ({
                        number: Number(verse["@_vnumber"]),
                        content: String(verse["#text"] ?? ""), // ✅ aman dari undefined/number
                        chapterId: createdChapter.id,
                    })),
                });
            }
        }
        console.log("✅ Seed completed");
    }
    catch (error) {
        console.error(error);
        process.exit(1); // ✅ exit code yang benar
    }
    finally {
        await prisma_1.prisma.$disconnect();
    }
}
seed();
