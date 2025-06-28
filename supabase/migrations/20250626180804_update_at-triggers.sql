CREATE OR REPLACE FUNCTION public.insert_ratio_func()
RETURNS TRIGGER
SET search_path=''
AS $$
  BEGIN
    IF NEW.stop_loss = 0 THEN -- account for division by 0
      NEW.ratio = NULL;
    ELSE
      NEW.ratio = ROUND(NEW.take_profit / NEW.stop_loss, 2);
    END IF;

    RETURN NEW;
  END;
$$ LANGUAGE plpgsql
SECURITY INVOKER;
--> statement-breakpoint
CREATE OR REPLACE TRIGGER on_trade_insert_trg
BEFORE INSERT ON public.trades
FOR EACH ROW EXECUTE PROCEDURE public.insert_ratio_func();
--> statement-breakpoint

CREATE OR REPLACE FUNCTION public.update_timestamp_func()
RETURNS TRIGGER
SET search_path=''
AS $$
  BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql
SECURITY INVOKER;
-- Create a trigger for each table in the public schema that has an updated_at
-- column to update the column on every insert
DO $$
  DECLARE
    t text; -- to store the table name during the loop 
  BEGIN
    FOR t IN 
      SELECT table_name 
      FROM information_schema.columns
      WHERE column_name = 'updated_at' AND table_schema = 'public'
    LOOP
      EXECUTE FORMAT('CREATE OR REPLACE TRIGGER update_timestamp_trg
        BEFORE UPDATE ON %I 
        FOR EACH ROW EXECUTE PROCEDURE public.update_timestamp_func()'
      ,t);
    END LOOP;
  END;
$$ LANGUAGE plpgsql;
