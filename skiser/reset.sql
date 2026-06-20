-- Το παρόν SQL script χρησιμοποιείται από το πρόγραμμα "skiser/reset.sh"
-- το οποίο με τη σειρά του χρησιμοποιείται για την επανενεργοποίηση τού
-- server σκηνικού μετά από ανώμαλη διακοπή.

USE `pexevida`
;

DELETE FROM `sinedria`
;

DELETE FROM `energia`
;

DELETE FROM `dianomi`
;

DELETE FROM `trapezi`
;

DELETE FROM `sizitisi`
;
