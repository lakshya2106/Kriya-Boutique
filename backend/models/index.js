// const mongoose = require('mongoose')

// // ── DRESS ─────────────────────────────────────────────
// const DressSchema = new mongoose.Schema({
//   num:         { type: String },
//   category:    { type: String, required: true },
//   badge:       { type: String, default: '' },  // new | bestseller | sold-out | ''
//   tag:         { type: String },
//   name:        { type: String, required: true },
//   nameEn:      { type: String },
//   desc:        { type: String },
//   fabric:      { type: String },
//   work:        { type: String },
//   sizes:       { type: String },
//   lead:        { type: String },
//   price:       { type: String },
//   swatches:    [String],
//   colors:      [String],
//   photos:      [String],   // file paths like /uploads/abc.jpg
//   accentColor: { type: String, default: '#c8a45a' },
//   bgGlow:      { type: String },
//   order:       { type: Number, default: 0 },
// }, { timestamps: true })

// // ── CATEGORY ──────────────────────────────────────────
// const CategorySchema = new mongoose.Schema({
//   id:    { type: String, required: true, unique: true },
//   label: { type: String, required: true },
//   color: { type: String, default: '#c8a45a' },
//   order: { type: Number, default: 0 },
// }, { timestamps: true })

// // ── TESTIMONIAL ───────────────────────────────────────
// const TestimonialSchema = new mongoose.Schema({
//   name:     { type: String, required: true },
//   occasion: { type: String },
//   rating:   { type: Number, default: 5, min: 1, max: 5 },
//   text:     { type: String, required: true },
//   location: { type: String },
//   visible:  { type: Boolean, default: true },
//   order:    { type: Number, default: 0 },
// }, { timestamps: true })

// // ── INSTAGRAM POST ────────────────────────────────────
// const InstaPostSchema = new mongoose.Schema({
//   photo:   { type: String, required: true },
//   caption: { type: String },
//   likes:   { type: String, default: '0' },
//   url:     { type: String, default: '' },
//   order:   { type: Number, default: 0 },
// }, { timestamps: true })

// // ── BRAND / SITE SETTINGS ─────────────────────────────
// const BrandSchema = new mongoose.Schema({
//   key:   { type: String, required: true, unique: true },
//   value: { type: mongoose.Schema.Types.Mixed },
// }, { timestamps: true })

// // ── HERO PHOTO ────────────────────────────────────────
// const HeroSchema = new mongoose.Schema({
//   photo: { type: String, required: true },
// }, { timestamps: true })

// module.exports = {
//   Dress:       mongoose.model('Dress',       DressSchema),
//   Category:    mongoose.model('Category',    CategorySchema),
//   Testimonial: mongoose.model('Testimonial', TestimonialSchema),
//   InstaPost:   mongoose.model('InstaPost',   InstaPostSchema),
//   Brand:       mongoose.model('Brand',       BrandSchema),
//   Hero:        mongoose.model('Hero',        HeroSchema),
// }



const mongoose = require('mongoose')

// ── DRESS ─────────────────────────────────────────────
const DressSchema = new mongoose.Schema({
  num:         { type: String },
  category:    { type: String, required: true },
  badge:       { type: String, default: '' },  // new | bestseller | sold-out | ''
  showcase:    { type: Boolean, default: false }, // show in hero DressCard showcase
  tag:         { type: String },
  name:        { type: String, required: true },
  nameEn:      { type: String },
  desc:        { type: String },
  fabric:      { type: String },
  work:        { type: String },
  sizes:       { type: String },
  lead:        { type: String },
  price:       { type: String },
  swatches:    [String],
  colors:      [String],
  photos:      [String],
  accentColor: { type: String, default: '#c8a45a' },
  bgGlow:      { type: String },
  order:       { type: Number, default: 0 },
}, { timestamps: true })

// ── CATEGORY ──────────────────────────────────────────
const CategorySchema = new mongoose.Schema({
  id:    { type: String, required: true, unique: true },
  label: { type: String, required: true },
  color: { type: String, default: '#c8a45a' },
  order: { type: Number, default: 0 },
}, { timestamps: true })

// ── TESTIMONIAL ───────────────────────────────────────
const TestimonialSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  occasion: { type: String },
  rating:   { type: Number, default: 5, min: 1, max: 5 },
  text:     { type: String, required: true },
  location: { type: String },
  visible:  { type: Boolean, default: true },
  order:    { type: Number, default: 0 },
}, { timestamps: true })

// ── INSTAGRAM POST ────────────────────────────────────
const InstaPostSchema = new mongoose.Schema({
  photo:   { type: String, required: true },
  caption: { type: String },
  likes:   { type: String, default: '0' },
  url:     { type: String, default: '' },
  order:   { type: Number, default: 0 },
}, { timestamps: true })

// ── BRAND / SITE SETTINGS ─────────────────────────────
const BrandSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true })

// ── HERO PHOTO ────────────────────────────────────────
const HeroSchema = new mongoose.Schema({
  photo: { type: String, required: true },
}, { timestamps: true })

module.exports = {
  Dress:       mongoose.model('Dress',       DressSchema),
  Category:    mongoose.model('Category',    CategorySchema),
  Testimonial: mongoose.model('Testimonial', TestimonialSchema),
  InstaPost:   mongoose.model('InstaPost',   InstaPostSchema),
  Brand:       mongoose.model('Brand',       BrandSchema),
  Hero:        mongoose.model('Hero',        HeroSchema),
}